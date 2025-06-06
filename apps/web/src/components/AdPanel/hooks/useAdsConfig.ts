import { ContextApi, useTranslation } from '@pancakeswap/localization'
import { useMemo } from 'react'
import { AdsCampaignConfig } from '../types'

export enum AdsIds {
  TST_PERP = 'tst-perp',
}

type AdsConfigMap = {
  [key in AdsIds]: AdsCampaignConfig
}
const getPerpConfigs = (t: ContextApi['t']): AdsCampaignConfig[] => {
  return [
    // {
    //   id: AdsIds.TST_PERP,
    //   ad: {
    //     img: 'perp',
    //     texts: [
    //       {
    //         text: t('Trade Perpetual v2 to Win $10,000.'),
    //       },
    //       {
    //         text: t('Trade Now'),
    //         link: 'https://perp.pancakeswap.finance/en/futures/v2/BTCUSD',
    //       },
    //     ],
    //     btn: {
    //       text: t('Learn More'),
    //       link: 'https://blog.pancakeswap.finance/articles/trade-tst-trump-pepe-and-more-tokens-on-pancake-swap-perpetual-v2-on-chain-and-share-a-10-000-prize-pool?utm_source=Website&utm_medium=SwapPage&utm_campaign=Perps&utm_id=PerpsCampaign',
    //     },
    //     options: {
    //       imagePadding: '20px',
    //     },
    //   },
    //   infoStripe: {
    //     img: 'perp',
    //     texts: [
    //       {
    //         text: t('Trade $TST, $PEPE, and More on Perpetual V2 to Win $10,000.'),
    //       },
    //     ],
    //     btns: [
    //       {
    //         text: t('Trade Now'),
    //         link: 'https://perp.pancakeswap.finance/en/futures/v2/BTCUSD',
    //       },
    //       {
    //         text: t('Learn More'),
    //         link: 'https://blog.pancakeswap.finance/articles/trade-tst-trump-pepe-and-more-tokens-on-pancake-swap-perpetual-v2-on-chain-and-share-a-10-000-prize-pool?utm_source=Website&utm_medium=SwapPage&utm_campaign=Perps&utm_id=PerpsCampaign',
    //       },
    //     ],
    //   },
    // },
  ]
}

export const useAdsConfigs = (): AdsConfigMap => {
  const { t } = useTranslation()

  const AdsConfigs: AdsConfigMap = useMemo(
    () =>
      getPerpConfigs(t).reduce((acc, config) => {
        // eslint-disable-next-line no-param-reassign
        acc[config.id] = config
        return acc
      }, {} as AdsConfigMap),
    [t],
  )

  return AdsConfigs
}

export const useAdsConfig = (id: AdsIds) => {
  const configs = useAdsConfigs()
  return configs[id]
}
