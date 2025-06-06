import { useMemo } from 'react'

import { Field } from 'state/swap/actions'

import { PriceOrder } from '@pancakeswap/price-api-sdk'
import { useCurrencyBalances } from 'state/wallet/hooks'
import { useAccount } from 'wagmi'
import { useAllTypeBestTrade } from '../../Swap/V3Swap/hooks/useAllTypeBestTrade'
import { useSlippageAdjustedAmounts } from '../../Swap/V3Swap/hooks/useSlippageAdjustedAmounts'
import { useSwapCurrency } from '../../Swap/V3Swap/hooks/useSwapCurrency'

export function useUserInsufficientBalance(order: PriceOrder | undefined): boolean {
  const [inputCurrency, outputCurrency] = useSwapCurrency()
  const { tradeLoaded } = useAllTypeBestTrade()
  const { address: account } = useAccount()
  const relevantTokenBalances = useCurrencyBalances(account ?? undefined, [
    inputCurrency ?? undefined,
    outputCurrency ?? undefined,
  ])

  const slippageAdjustedAmounts = useSlippageAdjustedAmounts(order)
  const isInsufficientBalance = useMemo(() => {
    const currencyBalances = {
      [Field.INPUT]: relevantTokenBalances[0],
      [Field.OUTPUT]: relevantTokenBalances[1],
    }
    if (!account || !order || !tradeLoaded) {
      return false
    }

    // use the actual input amount instead of the slippage adjusted amount
    const balanceIn = currencyBalances[Field.INPUT]
    const actualInputAmount = order.trade?.inputAmount

    if (balanceIn && actualInputAmount && balanceIn.lessThan(actualInputAmount)) {
      return true
    }
    return false
  }, [account, relevantTokenBalances, order, tradeLoaded])

  return isInsufficientBalance
}
