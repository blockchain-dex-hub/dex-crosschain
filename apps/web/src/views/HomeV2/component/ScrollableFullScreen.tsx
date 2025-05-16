import { ArrowDownIcon, useMatchBreakpoints } from '@pancakeswap/uikit'
import React, { useState } from 'react'
import styled from 'styled-components'
import { ScrollDownArrow } from '../cards/component/ScrollDownArrow'
import { snapToNext } from '../hook/useScrollToNearestSnap'

interface ScrollableFullScreenProps {
  children: React.ReactNode
  headerSelector?: string
}

const FullScreenContainer = styled.div<{ offsetHeight: number }>`
  scroll-snap-align: start;
  height: calc(100vh - ${({ offsetHeight }) => offsetHeight}px);
  width: 100%;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export const ScrollableFullScreen: React.FC<ScrollableFullScreenProps> = ({ children, headerSelector = '#nav' }) => {
  const [headerHeight, setHeaderHeight] = useState(0)
  const { isMobile, isTablet } = useMatchBreakpoints()

  React.useEffect(() => {
    const header = document.querySelector(headerSelector)
    if (header) {
      const rect = header.getBoundingClientRect()
      setHeaderHeight(rect.height)
    }
  }, [headerSelector])

  return (
    <FullScreenContainer offsetHeight={headerHeight} className="homepage-snap">
      {children}
      <ScrollDownArrow
        isMobile={isMobile}
        isTablet={isTablet}
        onClick={() => {
          snapToNext('down', 'homepage-snap', window.innerHeight * 0.1)
        }}
      >
        <ArrowDownIcon width="32px" color="textSubtle" />
      </ScrollDownArrow>
    </FullScreenContainer>
  )
}
