import { createAction } from '@reduxjs/toolkit'
import { AccountInfo } from './types';

export const accountInfo = createAction<{accountInfo: AccountInfo}>('wallet/acountInfo')
export const wrongNetwork = createAction<{wrongNetwork: boolean}>('wallet/wrongNetwork')
export const funds = createAction<{funds: any}>('wallet/funds')
export const leasePeriods = createAction<{leasePeriods: any}>('wallet/leasePeriods')
export const ownedIds = createAction<{ownedIds: any}>('wallet/ownedIds')
export const auctionInfos = createAction<{auctionInfos: any}>('wallet/auctionInfos')
export const cloverAccounts = createAction<{cloverAccounts: any}>('wallet/cloverAccounts')
