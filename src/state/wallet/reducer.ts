import { createReducer } from '@reduxjs/toolkit';
import { createAccountInfo } from '../../utils/AccountUtils';
import { accountInfo, wrongNetwork, funds, leasePeriods, ownedIds, auctionInfos } from './actions';
import { AccountInfo } from './types';

export interface WalletState {
  accountInfo: AccountInfo,
  wrongNetwork: boolean,
  funds: any,
  leasePeriods: any,
  ownedIds: any,
  auctionInfos: any,
}

const initialState: WalletState = {
  accountInfo: createAccountInfo('', '', '', []),
  wrongNetwork: false,
  funds: [],
  leasePeriods: '',
  ownedIds: [],
  auctionInfos: {},
}

export default createReducer(initialState, builder =>
  builder
    .addCase(accountInfo, (state, action) => {
      const {accountInfo} = action.payload
      state.accountInfo = accountInfo
    })
    .addCase(wrongNetwork, (state, action) => {
      const {wrongNetwork} = action.payload
      state.wrongNetwork = wrongNetwork
    })
    .addCase(funds, (state, action) => {
      const {funds} = action.payload
      state.funds = funds
    })
    .addCase(leasePeriods, (state, action) => {
      const {leasePeriods} = action.payload
      state.leasePeriods = leasePeriods
    })
    .addCase(ownedIds, (state, action) => {
      const {ownedIds} = action.payload
      state.ownedIds = ownedIds
    })
    .addCase(auctionInfos, (state, action) => {
      const {auctionInfos} = action.payload
      state.auctionInfos = auctionInfos
    })
);
