export const REGISTER_WIDGET = "REGISTER_WIDGET";
export const ADD_WIDGET = "ADD_WIDGET";
export const REMOVE_WIDGET = "REMOVE_WIDGET";
export const INIT_SOURCES = "INIT_SOURCES";
export const CLEAR_SOURCES = "CLEAR_SOURCES";
export const REMOVE_SOURCES = "REMOVE_SOURCES";
export const SOURCES_CHANGED = "SOURCES_CHANGED";

export function registerWidget(widgetType, config = {}) {

  const widgetProperties = config.class.properties || {};

  Object.defineProperty(config.class, 'properties', {
    get() {
      return {
        ...widgetProperties,
        sourceProvider: {
          type: String,
          attribute: 'source-provider',
          reflect: true
        },
        sourceKey: {
          type: String,
          attribute: 'source-key',
          reflect: true
        },
        widgetId: {
          type: String,
          attribute: 'widget-id'
        }
      }
    }
  });

  config = { 
    class: null,
    label: widgetType,
    category: 'Unknown',
    image: '',
    ...config
  };

  // Make this happen after the action is dispatched
  // TODO: Find a better way to do this. maybe thunks?
  setTimeout(() => {
    customElements.define(widgetType, config.class);
  });

  return {
    type: REGISTER_WIDGET,
    payload: {
      widgetType,
      config
    }
  };
}

export function addWidget(widgetType, row, col) {
  return {
    type: ADD_WIDGET,
    payload: {
      widgetType,
      id: 0,
      initialPosition: {
        row,
        col
      }
    }
  };
}

export function removeWidget(widgetId) {
  return {
    type: REMOVE_WIDGET,
    payload: {
      widgetId
    }
  };
}

export function initSources(providerName) {
  return {
    type: INIT_SOURCES,
    payload: {
      providerName
    }
  };
}

export function clearSources(providerName) {
  return {
    type: CLEAR_SOURCES,
    payload: {
      providerName
    }
  };
};

export function removeSources(providerName) {
  return {
    type: REMOVE_SOURCES,
    payload: {
      providerName
    }
  };
};

export function sourcesChanged(providerName, sourceChanges) {
  return {
    type: SOURCES_CHANGED,
    payload: {
      providerName,
      sourceChanges
    }
  };
}