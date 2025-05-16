import { Box, Link } from '@pancakeswap/uikit'
import { VerticalDivider } from '@pancakeswap/widgets-internal'
import { AdsIds, useAdsConfig } from '../hooks/useAdsConfig'
import { AdTextConfig } from '../types'
import { TextHighlight } from './TextHighlight'

export const InfoStripeCommon = (props: { id: AdsIds }) => {
  const config = useAdsConfig(props.id).infoStripe
  return (
    <Box mr={['6px']}>
      {config.texts.map((text, index) => {
        const key = `${text.text}-${index}`
        return <RenderText key={key} config={text} />
      })}{' '}
      {config.btns.map((btn, index) => {
        const keyBtn = `btn-${index}`
        const keyDiv = `div-${index}`
        return (
          <>
            <Link external display="inline !important" fontSize={['12px', '12px', '14px']} href={btn.link} key={keyBtn}>
              {btn.text}
            </Link>

            {index !== config.btns.length - 1 && (
              <VerticalDivider
                key={keyDiv}
                bg="#53DEE9"
                style={{
                  display: 'inline-block',
                  verticalAlign: 'middle',
                  height: '18px',
                  opacity: 0.4,
                  width: '1px',
                  marginLeft: '0px',
                  marginRight: '8px',
                }}
              />
            )}
          </>
        )
      })}
    </Box>
  )
}

const RenderText = ({ config }: { config: AdTextConfig }) => {
  return <TextHighlight text={config.text} highlights={config.highlights || []} />
}
