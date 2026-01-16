import {combineReducers} from 'redux';
import {CLEAR_APP_STATE} from '../actionTypes/actionTypes';

import GlobalReducers from './globalReducers';
import LoginReducers from './loginReducers';
import DashReducers from './dashboardReducers';
import ShopReducers from './shopReducers';
import OrderReducer from './orderReducers';
import dataCollectionReducers from './dataCollectionReducers';
import geofenceReducers from './geofenceReducers';
import locationReducers from './locationReducers';
/**
 * Add All reducers in object combineReducers which are created
 */
const AppReducers = combineReducers({
  globalReducer: GlobalReducers,
  loginReducer: LoginReducers,
  dashReducer: DashReducers,
  shopReducer: ShopReducers,
  orderReducer: OrderReducer,
  dataCollectionReducers: dataCollectionReducers,
  geofenceReducer: geofenceReducers,
  locationReducer: locationReducers,
});

/**
 *
 * @param state
 * @param action
 * @returns app reducer with current state is CLEAR_APP_STATE action is not dispatched
 * if action CLEAR_APP_STATE get's hit it will return all initial state reducers value
 *
 */
const RootReducer = (state: any, action: any) => {
  if (action.type === CLEAR_APP_STATE) {
    return AppReducers(undefined, action);
  }
  return AppReducers(state, action);
};
export default RootReducer;
