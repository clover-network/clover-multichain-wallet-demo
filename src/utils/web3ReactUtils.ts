import { CloverConnector } from '@clover-network/clover-connector'
import Web3 from 'web3'

export const cloverConnector = new CloverConnector({ supportedChainIds: [1, 3, 56, 97] })

export const getLibrary = (provider: any): Web3 => {
  return provider
}