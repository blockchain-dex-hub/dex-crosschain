import { SwapUIV2 } from '@pancakeswap/widgets-internal'
import { useState } from 'react'
import { styled } from 'styled-components'

export const PanelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  padding: 16px;
  border-radius: 24px;
  background-color: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
`
interface ButtonAndDetailsPanelProps {
  shouldRenderDetails?: boolean

  swapCommitButton: React.ReactNode
  pricingAndSlippage: React.ReactNode
  tradeDetails: React.ReactNode
  mevToggleSlot?: React.ReactNode
  mevSlot?: React.ReactNode
  gasTokenSelector?: React.ReactNode
}

export const ButtonAndDetailsPanel: React.FC<ButtonAndDetailsPanelProps> = ({
  shouldRenderDetails,
  swapCommitButton,
  pricingAndSlippage,
  tradeDetails,
  mevSlot,
  gasTokenSelector,
  mevToggleSlot,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <PanelWrapper>
      {swapCommitButton}
      {mevSlot}
      {gasTokenSelector}
      {shouldRenderDetails && (
        <SwapUIV2.Collapse
          isOpen={isOpen}
          onToggle={() => setIsOpen(!isOpen)}
          title={pricingAndSlippage}
          content={tradeDetails}
        />
      )}
      {mevToggleSlot}
    </PanelWrapper>
  )
}
