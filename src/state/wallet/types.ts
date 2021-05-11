import { TokenType } from '../token/types'
import { SerializableBigNum } from '../../types/bigNum'

export type TokenAmount = {
  tokenType: TokenType,
  amount: string, // TODO: remove and use amountBN instead
  amountBN: SerializableBigNum
}

export type AccountInfo = {
  address: string,
  name: string,
  walletName: string,
  tokenAmounts: TokenAmount[]
}