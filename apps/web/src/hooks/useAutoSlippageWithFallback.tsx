import { ExclusiveDutchOrderTrade } from '@pancakeswap/pcsx-sdk'
import { SmartRouterTrade, V4Router } from '@pancakeswap/smart-router'
import { Currency, CurrencyAmount, TradeType } from '@pancakeswap/swap-sdk-core'
import { useUserSlippage } from '@pancakeswap/utils/user'
import { atom, useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useAllTypeBestTrade } from 'views/Swap/V3Swap/hooks/useAllTypeBestTrade'
import useClassicAutoSlippageTolerance, {
  MIN_DEFAULT_SLIPPAGE_NUMERATOR,
  useInputBasedAutoSlippage,
} from './useAutoSlippage'

// Atom to store the user's preference for auto slippage
const autoSlippageEnabledAtom = atomWithStorage('pcs:auto-slippage-enabled-2', true)
const autoSlippageValueAtom = atom(MIN_DEFAULT_SLIPPAGE_NUMERATOR)

export const useAutoSlippageAtom = () => {
  return useAtom(autoSlippageValueAtom)
}

export const useAutoSlippageEnabled = () => {
  return useAtom(autoSlippageEnabledAtom)
}

type SupportedTrade =
  | SmartRouterTrade<TradeType>
  | V4Router.V4TradeWithoutGraph<TradeType>
  | ExclusiveDutchOrderTrade<Currency, Currency>

/**
 * Returns the slippage tolerance based on user settings or auto-calculated value
 * If auto slippage is enabled, it will use the auto-calculated value
 * Otherwise, it will use the user's manually set slippage
 */
export function useAutoSlippageWithFallback(): {
  slippageTolerance: number
  isAuto: boolean
} {
  const [isAutoSlippageEnabled] = useAutoSlippageEnabled()
  const [userSlippageTolerance] = useUserSlippage()
  const [autoSlippageTolerance] = useAutoSlippageAtom()

  return useMemo(() => {
    if (isAutoSlippageEnabled) {
      return {
        slippageTolerance: autoSlippageTolerance,
        isAuto: true,
      }
    }

    return {
      slippageTolerance: userSlippageTolerance,
      isAuto: false,
    }
  }, [isAutoSlippageEnabled, autoSlippageTolerance, userSlippageTolerance])
}

export const useInputBasedAutoSlippageWithFallback = (inputAmount?: CurrencyAmount<Currency>) => {
  const [isAutoSlippageEnabled] = useAutoSlippageEnabled()
  const [userSlippageTolerance] = useUserSlippage()
  const { inputBasedSlippage } = useInputBasedAutoSlippage(inputAmount)

  return useMemo(() => {
    if (isAutoSlippageEnabled && inputAmount && inputBasedSlippage) {
      return {
        slippageTolerance: Number(inputBasedSlippage.numerator),
        isAuto: true,
      }
    }

    return {
      slippageTolerance: userSlippageTolerance,
      isAuto: false,
    }
  }, [isAutoSlippageEnabled, inputAmount, inputBasedSlippage, userSlippageTolerance])
}

export const AutoSlippageProvider = ({ children }: { children?: React.ReactNode }) => {
  return (
    <>
      {children}
      <Sync />
    </>
  )
}
export const Sync = () => {
  const result = useAllTypeBestTrade()
  const tradeRef = useRef(result?.bestOrder?.trade)
  const isSameOrder = useMemo(() => {
    if (!tradeRef.current || !result?.bestOrder?.trade) return false
    return (
      tradeRef.current?.inputAmount?.currency?.equals(result?.bestOrder?.trade?.inputAmount?.currency) &&
      tradeRef.current?.outputAmount?.currency?.equals(result?.bestOrder?.trade?.outputAmount?.currency) &&
      tradeRef.current?.tradeType === result?.bestOrder?.trade?.tradeType &&
      tradeRef.current?.inputAmount?.equalTo(result?.bestOrder?.trade?.inputAmount) &&
      tradeRef.current?.outputAmount?.equalTo(result?.bestOrder?.trade?.outputAmount)
    )
  }, [result?.bestOrder])

  const autoSlippage = useClassicAutoSlippageTolerance(result?.bestOrder?.trade)
  const [, setAutoSlippageValue] = useAutoSlippageAtom()
  const updateAutoSlippage = useCallback(() => {
    if (autoSlippage) {
      setAutoSlippageValue(Number(autoSlippage.numerator))
    }
  }, [autoSlippage])
  useEffect(() => {
    if (!isSameOrder) {
      tradeRef.current = result?.bestOrder?.trade
      updateAutoSlippage()
    }
  }, [isSameOrder, updateAutoSlippage])
  return null
}
