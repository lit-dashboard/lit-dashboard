import { createStore, applyMiddleware } from "redux";
import rootReducer from "./reducer"; 
import { REGISTER_WIDGET } from './actions';
import { triggerEvent } from './app';

const createDashboardStore = () => {

  const fireEventsMiddleware = store => next => action => {

    next(action);

    if (action.type === REGISTER_WIDGET) {
      triggerEvent('registerWidget');
    }
  };


  const middleware = applyMiddleware(fireEventsMiddleware);
  return createStore(rootReducer, middleware);
};

window.litDashboardStore = window.litDashboardStore || createDashboardStore();

export default window.litDashboardStore;