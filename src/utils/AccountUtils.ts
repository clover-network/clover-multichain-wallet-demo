import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { AccountInfo, TokenAmount } from '../state/wallet/types';
import BigNum from '../types/bigNum'
import { api } from './apiUtils'
import keyring from '@polkadot/ui-keyring';
import _ from 'lodash'

export const originName = 'clv';
declare global {
  interface Window {
      send:any;
  }
}

export function getAddress (addr: string): string {
    if (_.size(addr) < 17) {
      return addr
    }

    const prefix = addr.substring(0, 11)
    const suffix = addr.substring(_.size(addr) - 4, _.size(addr))

    return `${prefix}..${suffix}`
  }

export function createAccountInfo(address: string, name: string, walletName: string, tokenAmounts: TokenAmount[]): AccountInfo {
  return {
    address, name, walletName, tokenAmounts
  }
}

export async function loadAllTokenAmount(addr: string): Promise<TokenAmount[]|null> {
  const rawApi = api.getApi();
  const { parentHash } = await rawApi.rpc.chain.getHeader();
  const {
    data: { free: balance },
  } = await rawApi.query.system.account.at(parentHash, addr);
  return [{
    tokenType: {
      id: -1,
      name: ''
    },
    amount: balance.toString(),
    amountBN: BigNum.fromBigNum(balance.toString()).toSerizableBigNum()
  }];
}

function isCloverWallet(injectedWallet: any) {
  return injectedWallet.name === 'clover'
}

function invalidWalletNetwork(allAccounts: InjectedAccountWithMeta[]): boolean {
  // @ts-ignore
  keyring.loadAll({ ss58Format: 42, type: 'ed25519' }, allAccounts);
  const accounts = keyring.getAccounts();
  const addrs = _.map(accounts, (acc) => acc.address)
  return _.some(allAccounts, (acc) => !_.includes(addrs, acc.address))
}

export async function loadAccount(updateAccountInfo: (info: AccountInfo) => void, updateWrongNetwork: (wrong: boolean) => void): Promise<Object> {
  const injected = await web3Enable(originName);
  window.send && window.send("log", injected)
  if (!injected.length) {
    return {
      message: "Not found wallet",
      status: 'error'
    };
  }

  const cloverWallet: any = _.find(injected, (w: any) => isCloverWallet(w))
  if (_.isEmpty(cloverWallet)) {
    return {
      message: "Not found wallet",
      status: 'error'
    };
  }

  const allAccounts = await web3Accounts();
  window.send && window.send("log", allAccounts)
  if (!allAccounts.length) {
    return {
      message: "Add account",
      status: 'error'
    }
  }

  if (invalidWalletNetwork(allAccounts)) {
    updateWrongNetwork(true)
    return {
      message: "Change to valid network",
      status: 'error'
    }
  }

  const tokenAmounts = await loadAllTokenAmount(allAccounts[0].address)
  if (tokenAmounts === null) {
    return {
      message: "Add account",
      status: 'error'
    }
  }

  const info = createAccountInfo(allAccounts[0].address,
    allAccounts[0].meta?.name ?? '',
    '' + 'Clover Wallet',
    tokenAmounts ?? [])
  updateAccountInfo(info)
  return {
    message: "Connect success",
    status: 'success'
  }
}

