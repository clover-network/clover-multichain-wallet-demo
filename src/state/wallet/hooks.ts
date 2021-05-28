import { AppState } from '../index'
import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { accountInfo, wrongNetwork, funds, leasePeriods, ownedIds, auctionInfos, cloverAccounts } from './actions'
import { AccountInfo } from './types'

export function useAccountInfo(): AccountInfo {
  return useSelector((state: AppState) => state.wallet.accountInfo)
}

export function useAccountInfoUpdate(): (info: AccountInfo) => void {
  const dispatch = useDispatch()
  return useCallback((info: AccountInfo) => dispatch(accountInfo({accountInfo: info})), [dispatch])
}

export function useWrongNetwork(): boolean {
  return useSelector((state: AppState) => state.wallet.wrongNetwork)
}

export function useWrongNetworkUpdate(): (wrong: boolean) => void {
  const dispatch = useDispatch()
  return useCallback((wrong: boolean) => dispatch(wrongNetwork({wrongNetwork: wrong})), [dispatch])
}

export function useFunds(): any {
  return useSelector((state: AppState) => state.wallet.funds)
}

export function useFundsUpdate(): (fund: any) => void {
  const dispatch = useDispatch()
  return useCallback((fund: any) => dispatch(funds({funds: fund})), [dispatch])
}

export function useLeasePeriod(): any {
  return useSelector((state: AppState) => state.wallet.leasePeriods)
}

export function useLeasePeriodUpdate(): (leasePeriod: any) => void {
  const dispatch = useDispatch()
  return useCallback((leasePeriod: any) => dispatch(leasePeriods({leasePeriods: leasePeriod})), [dispatch])
}

export function useOwnedIds(): any {
  return useSelector((state: AppState) => state.wallet.ownedIds)
}

export function useOwnedIdsUpdate(): (ownedId: any) => void {
  const dispatch = useDispatch()
  return useCallback((ownedId: any) => dispatch(ownedIds({ownedIds: ownedId})), [dispatch])
}

export function useAuctionInfo(): any {
  return useSelector((state: AppState) => state.wallet.auctionInfos)
}

export function useAuctionInfoUpdate(): (auctionInfo: any) => void {
  const dispatch = useDispatch()
  return useCallback((auctionInfo: any) => dispatch(auctionInfos({auctionInfos: auctionInfo})), [dispatch])
}

export function useCloverAccounts(): any {
  return useSelector((state: AppState) => state.wallet.cloverAccounts)
}

export function useCloverAccountsUpdate(): (cloverAccount: any) => void {
  const dispatch = useDispatch()
  return useCallback((cloverAccount: any) => dispatch(cloverAccounts({cloverAccounts: cloverAccount})), [dispatch])
}