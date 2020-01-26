import { sourcesChanged } from './actions';
import { forEach } from 'lodash';
import store from './store';
import { addSourceProvider, normalizeKey } from './app';

export default class SourceManager {

  constructor(providerType, providerName, settings) {
    this.providerName = providerName;
    this.provider = addSourceProvider(
      providerType, providerName, settings
    );
    this.sourceUpdates = {};

    this.provider.updateFromProvider(this.updateSource.bind(this));

    this.interval = setInterval(this._sendUpdates.bind(this), 100);
  }

  disconnect() {
    clearTimeout(this.interval);
  }

  updateSource(key, {value, type, name }) {
    if (this.sourceUpdates[key] === undefined) {
      this.sourceUpdates[key] = {
        first: { value, type, name }
      };
    }
    else {
      this.sourceUpdates[key].last = {
        value, type, name
      };
    }
  }

  getSource(key = '') {
    let sourcesRoot = store.getState().sources[this.providerName];

    if (typeof sourcesRoot === 'undefined') {
      return null;
    }

    const keyParts = normalizeKey(key).split('/');
  
    let sources = sourcesRoot.__sources__;
  
    for (let index in keyParts) {
      const keyPart = keyParts[index];
  
      if (keyParts.length - 1 === parseInt(index)) {
        return (keyPart in sources) ? sources[keyPart] : null;
      }
  
      if (keyPart in sources) {
        sources = sources[keyPart].__sources__;
      } else {
        return null;
      }
    }
  
    return null;
  }

  _sendUpdates() {

    if (Object.keys(this.sourceUpdates).length === 0) {
      return;
    }
    // send first updates then last
    const firstUpdates = {};
    const lastUpdates = {};
    forEach(this.sourceUpdates, (values, key) => {
      firstUpdates[key] = values.first;
      if ('last' in values)
        lastUpdates[key] = values.last;
    });

    store.dispatch(sourcesChanged(this.providerName, firstUpdates));
    if (Object.keys(lastUpdates).length > 0) {
      setTimeout(() => {
        store.dispatch(sourcesChanged(this.providerName, lastUpdates));
      });
    }
  
    this.sourceUpdates = {};
  }
}
