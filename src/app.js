
export const addSourceManager = (type, name, settings) => {
  window.dashboardApp.addSourceManager(type, name, settings);
};

export const hasSourceManager = (providerName) => {
  return window.dashboardApp.hasSourceManager(providerName);
};

export const getSourceManager = (providerName) => {
  return window.dashboardApp.getSourceManager(providerName);
};

export const removeSourceManager = (providerName) => {
  window.dashboardApp.removeSourceManager(providerName);
};

export const normalizeKey = (key) => {
  return window.dashboardApp.normalizeKey(key);
};

export const addSourceProviderType = (constructor) => {
  return window.dashboardApp.addSourceProviderType(constructor);
};

export const hasSourceProviderType = (typeName) => {
  return window.dashboardApp.hasSourceProviderType(typeName);
}

export const addSourceProvider = (type, name, settings) => {
  return window.dashboardApp.addSourceProvider(type, name, settings);
};

export const getSourceProvider = (providerName) => {
  return window.dashboardApp.getSourceProvider(providerName);
};

export const getSourceProviderNames = () => {
  return window.dashboardApp.getSourceProviderNames();
};

export const hasSourceProvider = (providerName) => {
  return window.dashboardApp.hasSourceProvider(providerName);
};

export const onEvent = (eventName, callback) => {
  window.dashboardApp.onEvent(eventName, callback);
};

export const triggerEvent = (eventName, ...args) => {
  window.dashboardApp.triggerEvent(eventName, ...args);
};

export const getPageX = () => {
  return window.dashboardApp.getPageX();
};

export const getPageY = () => {
  return window.dashboardApp.getPageY();
};

export const registerWidget = (tagName, config) => {
  return window.dashboardApp.registerWidget(tagName, config);
};