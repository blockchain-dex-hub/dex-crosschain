import { Currency } from '@pancakeswap/swap-sdk-core'
import { Flex, Text } from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from '@pancakeswap/widgets-internal'
import { useMemo } from 'react'
import { PoolInfo } from 'state/farmsV4/state/type'
import { useChainNameByQuery, useMultiChainPath } from 'state/info/hooks'
import styled from 'styled-components'
import { formatAmount } from 'utils/formatInfoNumbers'
import { getTokenSymbolAlias } from 'utils/getTokenAlias'
import { CurrencyLogo } from 'views/Info/components/CurrencyLogo'

const TokenButton = styled(Flex)`
  padding: 8px 0px;
  margin-right: 16px;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

type PoolCurrenciesProps = {
  poolInfo?: PoolInfo | null
}

function getTokenUrls(chainPath: string, poolInfo?: PoolInfo | null) {
  if (!poolInfo) {
    return { token0Url: '', token1Url: '' }
  }

  const { protocol } = poolInfo
  const stableSwapUrlQuery = protocol === 'stable' ? '?type=stableSwap' : ''

  const v2Url = (token: Currency) => `/info${chainPath}/tokens/${token.wrapped.address}${stableSwapUrlQuery}`

  const v3Url = (token: Currency) => `/info/${protocol}/${chainPath}/tokens/${token.wrapped.address}`

  if (protocol === 'stable' || protocol === 'v2') {
    return {
      token0Url: v2Url(poolInfo.token0.wrapped),
      token1Url: v2Url(poolInfo.token1.wrapped),
    }
  }

  return {
    token0Url: v3Url(poolInfo.token0.wrapped),
    token1Url: v3Url(poolInfo.token1.wrapped),
  }
}
export const PoolCurrencies: React.FC<PoolCurrenciesProps> = ({ poolInfo }) => {
  const chainPath = useMultiChainPath()
  const chainName = useChainNameByQuery()
  const stableSwapUrlQuery = useMemo(() => {
    return poolInfo?.protocol === 'stable' ? '?type=stableSwap' : ''
  }, [poolInfo?.protocol])
  const [symbol0, symbol1] = useMemo(() => {
    const s0 = getTokenSymbolAlias(poolInfo?.token0.wrapped.address, poolInfo?.chainId, poolInfo?.token0.symbol)
    const s1 = getTokenSymbolAlias(poolInfo?.token1.wrapped.address, poolInfo?.chainId, poolInfo?.token1.symbol)
    return [s0, s1]
  }, [
    poolInfo?.chainId,
    poolInfo?.token0.symbol,
    poolInfo?.token0.wrapped.address,
    poolInfo?.token1.symbol,
    poolInfo?.token1.wrapped.address,
  ])

  const infoUrls = useMemo(() => {
    return getTokenUrls(chainPath, poolInfo)
  }, [chainPath, poolInfo])

  const hasSmallDifference = useMemo(() => {
    const { token0Price = 0, token1Price = 0 } = poolInfo ?? {}
    return poolInfo ? Math.abs(Number(token1Price) - Number(token0Price)) < 1 : false
  }, [poolInfo])

  if (!poolInfo) {
    return null
  }

  return (
    <Flex justifyContent="space-between" flexDirection={['column', 'column', 'column', 'row']}>
      <Flex flexDirection={['column', 'column', 'row']}>
        <NextLinkFromReactRouter to={infoUrls.token0Url}>
          <TokenButton>
            <CurrencyLogo address={poolInfo.token0.wrapped.address} size="24px" chainName={chainName} />
            <Text fontSize="16px" ml="4px" style={{ whiteSpace: 'nowrap' }} width="fit-content">
              {`1 ${symbol0} =  ${formatAmount(Number(poolInfo.token1Price ?? 0), {
                notation: 'standard',
                displayThreshold: 0.001,
                tokenPrecision: hasSmallDifference ? 'enhanced' : 'normal',
              })} ${symbol1}`}
            </Text>
          </TokenButton>
        </NextLinkFromReactRouter>
        <NextLinkFromReactRouter to={infoUrls.token1Url}>
          <TokenButton ml={[null, null, '10px']}>
            <CurrencyLogo address={poolInfo.token1.address} size="24px" chainName={chainName} />
            <Text fontSize="16px" ml="4px" style={{ whiteSpace: 'nowrap' }} width="fit-content">
              {`1 ${symbol1} =  ${formatAmount(Number(poolInfo.token0Price ?? 0), {
                notation: 'standard',
                displayThreshold: 0.001,
                tokenPrecision: hasSmallDifference ? 'enhanced' : 'normal',
              })} ${symbol0}`}
            </Text>
          </TokenButton>
        </NextLinkFromReactRouter>
      </Flex>
    </Flex>
  )
}
