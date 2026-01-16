import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { persistReducer, persistStore } from 'redux-persist';
import localforage from 'localforage';
import RootReducer from './reducers';
import { PERSIST_CONFIG_KEY, reducerName } from '../constants/reduxConstants';

// Configure localforage
localforage.config({
  name: 'ZyleminiPlusPWA',
  storeName: 'redux_persist',
  description: 'Redux persist storage for ZyleminiPlus PWA',
});

// Define Redux Persist configuration
const persistConfig = {
  key: PERSIST_CONFIG_KEY,
  storage: localforage,
  whitelist: [
    reducerName.GLOBLE_REDUCER,
    reducerName.LOGIN_REDUCER,
    reducerName.DASH_REDUCER,
    reducerName.LOCATION_REDUCER,
  ],
  blacklist: [
    reducerName.SHOP_REDUCER,
    reducerName.ORDER_REDUCER,
    reducerName.DATA_COLLECTION_REDUCER,
    reducerName.GEOFENCE_REDUCER,
  ],
};

const persistedReducer = persistReducer(persistConfig, RootReducer);

const Store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: import.meta.env.DEV,
});

export type AppDispatch = typeof Store.dispatch;
export type RootState = ReturnType<typeof Store.getState>;
type DispatchFunc = () => AppDispatch;

export const useAppDispatch: DispatchFunc = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const persistor = persistStore(Store);

export default Store;
