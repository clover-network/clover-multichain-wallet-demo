import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { save, load } from 'redux-localstorage-simple';

import wallet from './wallet/reducer';
import api from './api/reducer'

// states that are auto persisted to localstorage and reloade
const PERSISTED_KEYS: string[] = ['application', 'settings'];

const store = configureStore({
  reducer: {
    wallet,
    api,
  },
  middleware: [...getDefaultMiddleware({ thunk: false }), save({ states: PERSISTED_KEYS })],
  preloadedState: load({ states: PERSISTED_KEYS })
});

export default store;

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
