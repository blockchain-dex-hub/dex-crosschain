import { Link, Text } from '@pancakeswap/uikit'
import { BodyText } from '../BodyText'
import { AdButton } from '../Button'
import { AdCard } from '../Card'
import { AdsIds, useAdsConfig } from '../hooks/useAdsConfig'
import { AdsConfig, AdTextConfig } from '../types'
import { getImageUrl } from '../utils'

export const AdCommon = (props: { id: AdsIds }) => {
  const config = useAdsConfig(props.id)
  return <AdCommonRender config={config.ad} />
}

export const AdCommonRender = ({ config }: { config: AdsConfig }) => {
  const { img, texts, btn, options } = config

  return (
    <AdCard imageUrl={getImageUrl(img)} imgPadding={options?.imagePadding}>
      <BodyText mb="0">
        {texts.map((textConfig, i) => {
          const key = `${textConfig.text}-${i}`
          return <AdTextRender key={key} config={textConfig} />
        })}
      </BodyText>
      <AdButton mt="16px" href={btn.link} externalIcon isExternalLink>
        {btn.text}
      </AdButton>
    </AdCard>
  )
}

export const AdTextRender = (props: { config: AdTextConfig }) => {
  const { config } = props
  if (config.subTitle) {
    return (
      <Text fontSize="inherit" as="span" color="secondary" bold>
        {config.text}
      </Text>
    )
  }
  if (config.link) {
    return (
      <Link fontSize="inherit" href={config.link} color="secondary" bold>
        {config.text}
      </Link>
    )
  }
  return <>{config.text}</>
}
