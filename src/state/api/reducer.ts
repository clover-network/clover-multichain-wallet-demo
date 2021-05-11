import { createReducer } from '@reduxjs/toolkit';
import { connected, inited, ready } from './actions';

export interface ApiState {
  connected: boolean,
  inited: boolean,
  ready: boolean
}

const initialState: ApiState = {
  connected: false,
  inited: false,
  ready: false
}

export default createReducer(initialState, builder =>
  builder
  .addCase(connected, (state, action) => {
    const {connected} = action.payload
    state.connected = connected
  })
  .addCase(inited, (state, action) => {
    const {inited} = action.payload
    state.inited = inited
  })
  .addCase(ready, (state, action) => {
    const {ready} = action.payload
    state.ready = ready
  })
);
