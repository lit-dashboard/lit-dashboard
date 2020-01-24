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
      settingsElement.prototype instanceof ProviderSettings;

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
      return 'String';
    } else if (isNumber(value)) {
      return 'Number';
    } else if (isBoolean(value)) {
      return 'Boolean';
    } else if (isArray(value)) {
      return 'Array';
    }
    return null;
  }
}