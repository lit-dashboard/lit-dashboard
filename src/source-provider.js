import { 
  isString, 
  isNumber, 
  isBoolean, 
  isArray, 
  isNull,
  kebabCase
} from 'lodash';
import ProviderSettings from './provider-settings';

export default class SourceProvider {
  
  static get typeName() {
    return null;
  }

  static get settingsElement() {
    return null;
  }

  static get settingsDefaults() {
		return {};
  }

  get settings() {
    return {};
  }

  get settingsElementName() {
    const { settingsElement, typeName } = this.constructor;
    if (isNull(settingsElement) || isNull(typeName)) {
      return null;
    }
    const isProviderSettings = 
      Object.getPrototypeOf(settingsElement.constructor).name === 'ProviderSettings';


    if (!isProviderSettings) {
      return null;
    }

    return kebabCase(typeName) + '-settings'; 
  }

  onSettingsChange(settings) {}

  updateFromProvider() {}
  updateFromDashboard() {}

  getType(value) {
    if (isString(value)) {
      return 'string';
    } else if (isNumber(value)) {
      return 'number';
    } else if (isBoolean(value)) {
      return 'boolean';
    } else if (isArray(value)) {
      return 'Array';
    } else if (isNull(value)) {
      return 'null';
    }
    return null;
  }
}
