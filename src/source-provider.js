import { isString, isNumber, isBoolean, isArray } from 'lodash';

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
    return getSettingsElementName(this.constructor);
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