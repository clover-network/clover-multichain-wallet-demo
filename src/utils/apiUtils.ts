import _ from 'lodash';
import { ApiPromise, WsProvider } from '@polkadot/api';
const cloverTypes = require('@clover-network/node-types/clover-node-types');

class ApiWrapper {
  private api: any

  setApi(api: any) {
    this.api = api
  }

  getApi() {
    return this.api
  }
}

export const api = new ApiWrapper()

export const initApi = async (onInited: () => void, onConnected: () => void, onDisConnected: () => void): Promise<void> => {
  if (!_.isEmpty(api.getApi())) {
    return
  }

  const wsProvider = new WsProvider('wss://api-ivy-elastic.clover.finance');

  const theApi = await ApiPromise.create({
    provider: wsProvider,
    types: cloverTypes, });
  api.setApi(theApi)
  theApi.on('connected', () => {
    console.log('connected')
    onConnected()
  })
  theApi.on('disconnected', () => {
    console.log('disconnected')
    onDisConnected()
  })
  theApi.on('ready', () => {
    console.log('ready')
  })

  onInited()
}
