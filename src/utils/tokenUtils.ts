import _ from 'lodash'
import { loadAllTokenAmount } from '../utils/AccountUtils'
import { AccountInfo } from '../state/wallet/types'

export async function subscribeToEvents(apiInited: boolean, myInfo: AccountInfo, updateAccountInfo: (info: AccountInfo) => void) {
  loadAllTokenAmount(myInfo.address).then((tokenAmounts) => {
    if (_.isEmpty(tokenAmounts)) {
      return
    }

    if (!_.isEqual(tokenAmounts, myInfo.tokenAmounts)) {
      updateAccountInfo({
        address: myInfo.address,
        name: myInfo.name,
        walletName: myInfo.walletName,
        tokenAmounts: tokenAmounts ?? []
      })
    }
  })
}
