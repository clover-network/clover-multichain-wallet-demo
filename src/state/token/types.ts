export type TokenType = {
  id: number,
  name: string,
  logo?: string
}

export const defaultTokenType = {
  id: -1, name: ''
}

export type CurrencyPair = {
  a: string,
  b: string
}


export type TokenState = {
  tokenTypes: TokenType[],
  currencyPairs: CurrencyPair[]
}

export type StakePoolItem = {
  fromTokenType: TokenType,
  toTokenType: TokenType,
  totalAmount: string,
  totalIncentive: string
}

