import { Box, Flex, useMatchBreakpoints } from '@pancakeswap/uikit'

import { styled } from 'styled-components'
import { StyledSwapContainer } from '../Swap/styles'
import { V4SwapFormForHomePage } from './V4Swap/V4SwapFormForHomepage'

const Wrapper = styled(Box)`
  width: 100%;
  ${({ theme }) => theme.mediaQueries.md} {
    min-width: 328px;
    max-width: 480px;
  }
`

export default function SimpleSwapForHomePage() {
  const { isMobile } = useMatchBreakpoints()

  return (
    <Flex
      width="100%"
      height="100%"
      justifyContent="center"
      position="relative"
      mt={isMobile ? '0px' : '-2px'}
      p={isMobile ? '16px' : '24px'}
    >
      <Flex flexDirection="column" alignItems="center" height="100%" width="100%" position="relative" zIndex={1}>
        <StyledSwapContainer justifyContent="center" width="100%" style={{ height: '100%' }} $isChartExpanded={false}>
          <Wrapper height="100%">
            <V4SwapFormForHomePage />
          </Wrapper>
        </StyledSwapContainer>
      </Flex>
    </Flex>
  )
}
