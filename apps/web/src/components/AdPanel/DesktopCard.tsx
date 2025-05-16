import { Box, useMatchBreakpoints } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { AdPlayer } from './AdPlayer'
import { AdPlayerProps } from './types'
import { useShowAdPanel } from './useShowAdPanel'

interface DesktopCardProps extends AdPlayerProps {
  shouldRender?: boolean
}
/**
 * Renders floating Ad banners on desktop
 */
export const DesktopCard = ({
  shouldRender = true,
  isDismissible = true,
  forceMobile = false,
  ...props
}: DesktopCardProps) => {
  const { isDesktop } = useMatchBreakpoints()
  const [show] = useShowAdPanel()

  return shouldRender && isDesktop && show ? (
    <FloatingContainer>
      <AdPlayer isDismissible={isDismissible} forceMobile={forceMobile} {...props} />
    </FloatingContainer>
  ) : null
}

const FloatingContainer = styled(Box)`
  position: absolute;
  right: 30px;
  bottom: 30px;
  z-index: 10000;
`
