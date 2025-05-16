import { useRouter } from 'next/router'
import { useTranslation } from '@pancakeswap/localization'
import { useToast } from '@pancakeswap/uikit'
import { CHAIN_QUERY_NAME } from 'config/chains'
import { ExtendEthereum } from 'global'
import { useCallback, useMemo } from 'react'
import { useAppDispatch } from 'state'
import { clearUserStates } from 'utils/clearUserStates'
import { Connector, useAccount, useSwitchChain } from 'wagmi'
import { useAtom } from 'jotai/index'
import { queryChainIdAtom } from 'hooks/useActiveChainId'
import { EXCHANGE_PAGE_PATHS } from 'config/constants/exchange'
import { getHashFromRouter } from 'utils/getHashFromRouter'
import { useSwitchNetworkLoading } from './useSwitchNetworkLoading'

const checkSwitchReloadNeeded = async (connector: Connector, chainId: number, address: `0x${string}` | undefined) => {
  try {
    if (typeof connector.getProvider !== 'function') return false

    const provider = (await connector.getProvider()) as any

    return Boolean(
      provider &&
        (provider.isTokenPocket ||
          (Array.isArray(provider.session?.namespaces?.eip155?.accounts) &&
            !provider.session.namespaces.eip155.accounts.some((account: string) =>
              account?.includes(`${chainId}:${address}`),
            ))),
    )
  } catch (error) {
    console.error(error, 'Error detecting provider')
    return false
  }
}

export function useSwitchNetworkLocal() {
  const [, setQueryChainId] = useAtom(queryChainIdAtom)
  const dispatch = useAppDispatch()
  const router = useRouter()

  const isBloctoMobileApp = useMemo(() => {
    try {
      return typeof window !== 'undefined' && Boolean((window.ethereum as ExtendEthereum)?.isBlocto)
    } catch (error) {
      console.error('Error checking Blocto mobile app:', error)
      return false
    }
  }, [])

  return useCallback(
    (newChainId: number) => {
      const { chain: queryChainName, chainId: queryChainId, persistChain } = router.query
      if (persistChain) return
      const newChainQueryName = CHAIN_QUERY_NAME[newChainId]
      const chainQueryName = queryChainName || CHAIN_QUERY_NAME[queryChainId as string]
      const removeQueriesFromPath =
        newChainQueryName !== chainQueryName &&
        EXCHANGE_PAGE_PATHS.some((item) => {
          return router.pathname === '/' || router.pathname.startsWith(item)
        })
      const uriHash = getHashFromRouter(router)?.[0]
      const { chainId: _chainId, ...omittedQuery } = router.query
      router.replace(
        {
          pathname: router.pathname,
          query: {
            ...(!removeQueriesFromPath && omittedQuery),
            chain: newChainQueryName,
          },
          ...(uriHash && { hash: uriHash }),
        },
        undefined,
        {
          shallow: true,
        },
      )
      setQueryChainId(newChainId)
      // Blocto in-app browser throws change event when no account change which causes user state reset therefore
      // this event should not be handled to avoid unexpected behaviour.
      if (!isBloctoMobileApp) {
        clearUserStates(dispatch, { chainId: newChainId, newChainId })
      }
    },
    [dispatch, isBloctoMobileApp, setQueryChainId, router],
  )
}

export function useSwitchNetwork() {
  const [loading, setLoading] = useSwitchNetworkLoading()
  const {
    status,
    switchChainAsync: _switchNetworkAsync,
    switchChain: _switchNetwork,
    ...switchNetworkArgs
  } = useSwitchChain()

  const _isLoading = status === 'pending'

  const { t } = useTranslation()

  const { toastError } = useToast()
  const { isConnected, connector, address } = useAccount()

  const switchNetworkLocal = useSwitchNetworkLocal()

  const isLoading = _isLoading || loading

  const switchNetworkAsync = useCallback(
    async (chainId: number) => {
      if (isConnected && connector && typeof _switchNetworkAsync === 'function') {
        if (isLoading) return undefined
        setLoading(true)
        return _switchNetworkAsync({ chainId })
          .then(async (c) => {
            switchNetworkLocal(chainId)
            if (await checkSwitchReloadNeeded(connector, chainId, address)) {
              window.location.reload()
            }
            return c
          })
          .catch(() => {
            // TODO: review the error
            toastError(t('Error connecting, please retry and confirm in wallet!'))
          })
          .finally(() => setLoading(false))
      }
      return new Promise(() => {
        switchNetworkLocal(chainId)
      })
    },
    [isConnected, _switchNetworkAsync, isLoading, setLoading, switchNetworkLocal, toastError, t, connector, address],
  )

  const switchNetwork = useCallback(
    (chainId: number) => {
      if (isConnected && typeof _switchNetwork === 'function') {
        return _switchNetwork({ chainId })
      }
      return switchNetworkLocal(chainId)
    },
    [_switchNetwork, isConnected, switchNetworkLocal],
  )

  const canSwitch = useMemo(
    () =>
      isConnected
        ? !!_switchNetworkAsync &&
          !(
            typeof window !== 'undefined' &&
            // @ts-ignore // TODO: add type later
            window.ethereum?.isMathWallet
          )
        : true,
    [_switchNetworkAsync, isConnected],
  )

  return {
    ...switchNetworkArgs,
    switchNetwork,
    switchNetworkAsync,
    isLoading,
    canSwitch,
  }
}
