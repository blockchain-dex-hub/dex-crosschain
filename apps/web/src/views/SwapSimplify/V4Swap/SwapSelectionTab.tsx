import { useTranslation } from '@pancakeswap/localization'
import { ButtonMenu, ButtonMenuItem } from '@pancakeswap/uikit'
import GlobalSettings from 'components/Menu/GlobalSettings'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { styled } from 'styled-components'
import { SettingsMode } from '../../../components/Menu/GlobalSettings/types'
import { SwapType } from '../../Swap/types'

// const ColoredIconButton = styled(IconButton)`
//   color: ${({ theme }) => theme.colors.textSubtle};
//   overflow: hidden;
// `

const StyledButtonMenuItem = styled(ButtonMenuItem)`
  height: 40px;
  padding: 0px 16px;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.textSubtle};
  * ${({ theme }) => theme.mediaQueries.md} {
    width: 124px;
    padding: 0px 24px;
  }
`

const SwapSelectionWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 4px;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: 24px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  ${({ theme }) => theme.mediaQueries.md} {
    gap: 16px;
  }
`

export const SwapSelection = ({
  swapType,
  withToolkit = false,
  style,
}: {
  swapType: SwapType
  withToolkit?: boolean
  style?: React.CSSProperties
}) => {
  const { t } = useTranslation()
  const router = useRouter()

  const onSelect = useCallback(
    (value: SwapType) => {
      let url = ''
      switch (value) {
        case SwapType.MARKET:
          url = '/'
          break
        default:
          break
      }
      router.push(url)
    },
    [router],
  )

  return (
    <SwapSelectionWrapper style={style}>
      <ButtonMenu
        scale="md"
        activeIndex={swapType}
        onItemClick={(index) => onSelect(index)}
        variant="subtle"
        noButtonMargin
        fullWidth
      >
        <StyledButtonMenuItem>{t('Swap')}</StyledButtonMenuItem>
        <span />
      </ButtonMenu>
      {/* NOTE: Commented out until charts are supported again */}

      {withToolkit && (
        <GlobalSettings
          color="textSubtle"
          mr="0"
          mode={SettingsMode.SWAP_LIQUIDITY}
          data-dd-action-name="Swap settings button"
          width="24px"
        />
      )}
    </SwapSelectionWrapper>
  )
}
