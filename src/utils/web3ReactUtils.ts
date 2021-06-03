import { Web3ReactProvider } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import Web3 from 'web3'

export const injectedConnector = new InjectedConnector({ supportedChainIds: [1, 3, 56, 97] })

export const getLibrary = (provider: any): Web3 => {
  return provider
}