import { SwapUIV2 } from '@pancakeswap/widgets-internal'
import { useAllTypeBestTrade } from '../../Swap/V3Swap/hooks/useAllTypeBestTrade'
import { FormMainForHomePage } from './FormMainV4ForHomePage'
import { ButtonAndDetailsPanel } from './ButtonAndDetailsPanel'
import { SwapCommitButton } from './SwapCommitButtonForHomepage'

export function V4SwapFormForHomePage() {
  const { bestOrder, tradeLoaded } = useAllTypeBestTrade()

  return (
    <SwapUIV2.SwapFormWrapper
      style={{
        marginBottom: 0,
      }}
    >
      <SwapUIV2.SwapTabAndInputPanelWrapper>
        <FormMainForHomePage
          tradeLoading={!tradeLoaded}
          inputAmount={bestOrder?.trade?.inputAmount}
          outputAmount={bestOrder?.trade?.outputAmount}
        />
      </SwapUIV2.SwapTabAndInputPanelWrapper>
      <ButtonAndDetailsPanel swapCommitButton={<SwapCommitButton />} pricingAndSlippage={null} tradeDetails={null} />
    </SwapUIV2.SwapFormWrapper>
  )
}
