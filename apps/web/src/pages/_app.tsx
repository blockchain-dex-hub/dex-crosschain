import { ResetCSS, ScrollToTopButtonV2, ToastListener } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { SentryErrorBoundary } from 'components/ErrorBoundary'
import GlobalCheckClaimStatus from 'components/GlobalCheckClaimStatus'
import { PageMeta } from 'components/Layout/Page'
import { SimpleStakingSunsetModal } from 'components/Modal/SimpleStakingSunsetModal'
import { NetworkModal } from 'components/NetworkModal'
import { FixedSubgraphHealthIndicator } from 'components/SubgraphHealthIndicator/FixedSubgraphHealthIndicator'
import TransactionsDetailModal from 'components/TransactionDetailModal'
import { VercelToolbar } from 'components/VercelToolbar'
import 'core-js/features/array/to-sorted'
import 'core-js/features/string/replace-all'
import { useAccountEventListener } from 'hooks/useAccountEventListener'
import useEagerConnect from 'hooks/useEagerConnect'
import useLockedEndNotification from 'hooks/useLockedEndNotification'
import useSentryUser from 'hooks/useSentryUser'
import useThemeCookie from 'hooks/useThemeCookie'
import useUserAgent from 'hooks/useUserAgent'
import { NextPage } from 'next'
import { DefaultSeo } from 'next-seo'
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import Script from 'next/script'
import { Fragment } from 'react'
import { PersistGate } from 'redux-persist/integration/react'
import 'utils/abortcontroller-polyfill'
import { V4CakeIcon } from 'views/Home/components/V4CakeIcon'

import { DesktopCard } from 'components/AdPanel/DesktopCard'
import { MobileCard } from 'components/AdPanel/MobileCard'
import { layoutDesktopAdIgnoredPages, layoutMobileAdIgnoredPages } from 'components/AdPanel/config'
import { shouldRenderOnPages } from 'components/AdPanel/renderConditions'
import { Cb1Membership } from 'components/Cb1/Cb1Membership'
import { ZKSyncAirdropModalWithAutoPopup } from 'components/ClaimZksyncAirdropModal'
import { useDataDogRUM } from 'hooks/useDataDogRUM'
import { useLoadExperimentalFeatures } from 'hooks/useExperimentalFeatureEnabled'
import useInitNotificationsClient from 'hooks/useInitNotificationsClient'
import { useVercelFeatureFlagOverrides } from 'hooks/useVercelToolbar'
import { useWalletConnectRouterSync } from 'hooks/useWalletConnectRouterSync'
import { useWeb3WalletView } from 'hooks/useWeb3WalletView'
import { useInitGlobalWorker } from 'hooks/useWorker'
import { persistor, useStore } from 'state'
import { usePollBlockNumber } from 'state/block/hooks'
import { Blocklist, Updaters } from '..'
import { SEO } from '../../next-seo.config'
import Providers from '../Providers'
import Menu, { SharedComponentWithOutMenu } from '../components/Menu'
import GlobalStyle from '../style/Global'

const EasterEgg = dynamic(() => import('components/EasterEgg'), { ssr: false })

// This config is required for number formatting
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

function GlobalHooks() {
  useInitGlobalWorker()
  useDataDogRUM()
  useWeb3WalletView()
  useLoadExperimentalFeatures()
  useVercelFeatureFlagOverrides()
  usePollBlockNumber()
  useEagerConnect()
  useUserAgent()
  useAccountEventListener()
  useSentryUser()
  useThemeCookie()
  useLockedEndNotification()
  useInitNotificationsClient()
  useWalletConnectRouterSync()
  return null
}

function MPGlobalHooks() {
  usePollBlockNumber()
  useUserAgent()
  useAccountEventListener()
  useSentryUser()
  useLockedEndNotification()
  useInitNotificationsClient()
  return null
}

const LoadVConsole = dynamic(() => import('components/vConsole'), { ssr: false })

function MyApp(props: AppProps<{ initialReduxState: any; dehydratedState: any }>) {
  const { pageProps, Component } = props
  const store = useStore(pageProps.initialReduxState)

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5, minimum-scale=1, viewport-fit=cover"
        />
        <meta
          name="description"
          content="Cheaper and faster than Uniswap? Discover PancakeSwap, the leading DEX on BNB Smart Chain (BSC) with the best farms in DeFi and a lottery for CAKE."
        />
        <meta name="theme-color" content="#1FC7D4" />
      </Head>
      <DefaultSeo {...SEO} />
      {/* <LoadVConsole /> */}
      <Providers store={store} dehydratedState={pageProps.dehydratedState}>
        <PageMeta />
        {(Component as NextPageWithLayout).Meta && (
          // @ts-ignore
          <Component.Meta {...pageProps} />
        )}
        <GlobalHooks />
        <ResetCSS />
        <GlobalStyle />
        <GlobalCheckClaimStatus excludeLocations={[]} />
        <PersistGate loading={null} persistor={persistor}>
          <Updaters />
          <App {...props} />
        </PersistGate>
      </Providers>
      <Script
        strategy="afterInteractive"
        id="google-tag"
        dangerouslySetInnerHTML={{
          __html: `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_NEW_GTAG}');
        `,
        }}
      />
    </>
  )
}

type NextPageWithLayout = NextPage & {
  Layout?: React.FC<React.PropsWithChildren<unknown>>
  /** render component without all layouts */
  pure?: true
  /** is mini program */
  mp?: boolean
  /**
   * allow chain per page, empty array bypass chain block modal
   * @default [ChainId.BSC]
   * */
  chains?: number[]
  isShowScrollToTopButton?: true
  screen?: true
  isShowV4IconButton?: false
  /**
   * Meta component for page, hacky solution for static build page to avoid `PersistGate` which blocks the page from rendering
   */
  Meta?: React.FC<React.PropsWithChildren<unknown>>
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const ProductionErrorBoundary = process.env.NODE_ENV === 'production' ? SentryErrorBoundary : Fragment

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  if (Component.pure) {
    return <Component {...pageProps} />
  }

  // Use the layout defined at the page level, if available
  const Layout = Component.Layout || Fragment
  const ShowMenu = Component.mp ? SharedComponentWithOutMenu : Menu
  const isShowScrollToTopButton = Component.isShowScrollToTopButton || true
  const shouldScreenWallet = Component.screen || false
  const isShowV4IconButton = Component.isShowV4IconButton || false

  return (
    <ProductionErrorBoundary>
      <ShowMenu>
        <Layout>
          <Component {...pageProps} />
          <MobileCard shouldRender={!shouldRenderOnPages(layoutMobileAdIgnoredPages)} mt="4px" mb="12px" />
          <DesktopCard shouldRender={!shouldRenderOnPages(layoutDesktopAdIgnoredPages)} />
        </Layout>
      </ShowMenu>
      <EasterEgg iterations={2} />
      <ToastListener />
      <FixedSubgraphHealthIndicator />
      <NetworkModal pageSupportedChains={Component.chains} />
      <TransactionsDetailModal />
      {isShowScrollToTopButton && <ScrollToTopButtonV2 />}
      {shouldScreenWallet && <Blocklist />}
      {isShowV4IconButton && <V4CakeIcon />}
      <ZKSyncAirdropModalWithAutoPopup />
      <SimpleStakingSunsetModal />
      <VercelToolbar />
      <Cb1Membership />
    </ProductionErrorBoundary>
  )
}

export default MyApp
