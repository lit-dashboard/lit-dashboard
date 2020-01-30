import { LitElement } from 'lit-element';
import store from './store';
import { isNull, forEach, isPlainObject } from 'lodash';
import { connect } from 'pwa-helpers';
import { 
  hasSourceManager,
  getSourceManager,
  getSourceProvider,
  triggerEvent,
  notifyError,
  notifySuccess
} from './app';
import { getWidgetSource } from './storage';

export default class Widget extends connect(store)(LitElement) {

  constructor() {
    super();

    this.widgetConfig = store.getState().widgets.registered[this.nodeName.toLowerCase()];
    if (!this.widgetConfig) {
      return;
    }

    forEach(this.constructor.properties, (property, name) => {
      if (['sourceProvider', 'sourceKey', 'widgetId'].includes(name)) {
        return;
      }

      const { type, attribute, reflect, structure } = property;

      if (attribute === false || !reflect) {
        return;
      }

      Object.defineProperty(this, name, {
        get() {
          const getter = this.constructor.properties[name].get;
          if (typeof getter === 'function') {
            return getter.bind(this)();
          }
          return this[`_${name}`];
        },
        set(value) {
          const sourceProvider = getSourceProvider(this.sourceProvider);

          if (isPlainObject(value) && value.__fromSource__) {
            const oldValue = this._value;
            this[`_${name}`] = value.__value__;
            this.requestUpdate(name, oldValue);
            this._dispatchPropertyChange(name, oldValue, value.__value__);
            return;
          } else if (typeof this.sourceKey === 'string' && sourceProvider) {
            const source = this.sourceManager.getSource(this.sourceKey);
            if (source) {
              const propSource = source.__sources__[name];

              if (typeof propSource === 'undefined') {
                if (this.constructor.properties[name].primary && source.__fromProvider__) {
                  sourceProvider.updateFromDashboard(this.sourceKey, value);
                  return;
                }
              } else if (propSource.__fromProvider__) {
                sourceProvider.updateFromDashboard(propSource.__key__, value);
                return;
              }
            }
          }

          const oldValue = this._value;
          this[`_${name}`] = value;
          this.requestUpdate(name, oldValue);
          this._dispatchPropertyChange(name, oldValue, value);
        }
      });
    });

    Object.defineProperty(this, 'sourceProvider', {
      get() {
        return this._sourceProvider;
      },
      set(value) {
        if (hasSourceManager(value)) {
          const oldValue = this._sourceProvider;
          this._sourceProvider = value;
          this.sourceManager = getSourceManager(value);
          this.requestUpdate('sourceProvider', oldValue);
          this._dispatchSourceProviderChange();
        }
      }
    });

    Object.defineProperty(this, 'sourceKey', {
      get() {
        return this._sourceKey;
      },
      set(value) {

        if (isNull(value) || isNull(this.sourceManager)) {
          return;
        }

        const oldValue = this._sourceKey;
        const source = this.sourceManager.getSource(value);
        const widgetId = this.getAttribute('widget-id');

        if (isNull(source)) {
          this._sourceKey = value;
          this.requestUpdate('sourceKey', oldValue);
          this._dispatchSourceKeyChange();
        } else {
          this._sourceKey = value;     
          this.requestUpdate('sourceKey', oldValue);
          this._dispatchSourceKeyChange();
          this._setPropsFromSource(source);
          notifySuccess(`
            Successfully added source to widget with ID '${widgetId}'.
          `);
        }
      }
    });

    this.sourceProvider = null;
    this.sourceManager = null;
    this.sourceKey = null;
    triggerEvent('widgetAdded', this);
    this._setInitialSourceKey();

    const resizeObserver = new ResizeObserver(() => {
      this.resized();
    });
    resizeObserver.observe(this);
  }

  async _setInitialSourceKey() {
    await this.updateComplete;
    const widgetId = this.getAttribute('widget-id');
    const source = getWidgetSource(widgetId);
    if (source) {
      this.sourceProvider = source.sourceProvider;
      this.sourceKey = source.key;
    }
  }

  _dispatchSourceKeyChange() {
    const event = new CustomEvent('source-key-change', {
      detail: {
        sourceKey: this.sourceKey
      },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }

  _dispatchPropertyChange(property, oldValue, newValue) {
    const event = new CustomEvent('property-change', {
      detail: {
        property,
        oldValue,
        newValue
      },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }

  _dispatchSourceProviderChange() {
    const event = new CustomEvent('source-provider-change', {
      detail: {
        sourceProvider: this.sourceProvider
      },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }

  _setPropsFromSource(source) {
    forEach(this.constructor.properties, (property, name) => {
      if (['sourceProvider', 'sourceKey', 'widgetId'].includes(name)) {
        return;
      }

      const { type, attribute, reflect, structure, primary } = property;

      if (attribute === false || !reflect) {
        return;
      }

      const propSource = source.__sources__[name];

      if (typeof propSource === 'undefined') {
        const value = this._generateSourceValue(source);
        if (primary) {
          this[name] = {
            __fromSource__: true,
            __value__: value
          }
        }
      } else {
        this[name] = {
          __fromSource__: true,
          __value__: this._generateSourceValue(propSource)
        }
      }
    });
  }

  _generateSourceValue(source) {
    const sourceProvider = getSourceProvider(this.sourceProvider);
    const rawValue = source.__value__;
    const sources = source.__sources__;

    if (typeof rawValue === 'boolean') {
      return rawValue;
    } else if (typeof rawValue === 'number') {
      return rawValue;
    } else if (typeof rawValue === 'string') {
      return rawValue;
    } else if (rawValue instanceof Array) {
      return [...rawValue];
    }

    let value = {};

    forEach(sources, (source, propertyName) => {
      const sourceValue = this._generateSourceValue(source);
      Object.defineProperty(value, propertyName, {
        get() {
          return sourceValue;
        },
        set(value) {
          const sourceKey = source.__key__;
          if (typeof sourceKey === 'string' && sourceProvider) {
            sourceProvider.updateFromDashboard(sourceKey, value);
          }
        }
      });
    });

    return value;
  }
  
  hasSource() {
    return !isNull(this.sourceKey) && typeof this.sourceKey !== 'undefined';
  }

  resized() {}

  stateChanged() {
    if (!this.sourceManager) {
      return;
    }

    const source = this.sourceManager.getSource(this.sourceKey);
    if (source) {
      this._setPropsFromSource(source);
    }
  }
}
