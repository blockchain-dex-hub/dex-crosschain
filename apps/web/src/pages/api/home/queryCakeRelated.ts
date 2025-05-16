import { ChainId } from '@pancakeswap/chains'
import { calcGaugesVotingABI } from '@pancakeswap/gauges'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { revenueSharingPoolProxyABI } from 'config/abi/revenueSharingPoolProxy'
import { veCakeABI } from 'config/abi/veCake'
import { WEEK } from 'config/constants/veCake'
import {
  getCalcGaugesVotingAddress,
  getRevenueSharingCakePoolAddress,
  getRevenueSharingVeCakeAddress,
  getVeCakeAddress,
} from 'utils/addressHelpers'
import { getViemClients } from 'utils/viem.server'
import { formatEther } from 'viem/utils'
import { BRIBE_APR, fetchCakePoolEmission } from 'views/CakeStaking/hooks/useAPR'
import { fetchCakeStats } from 'views/Home/components/CakeDataRow'
import { CakeRelatedFigures } from './types'

export async function queryCakeRelated() {
  const veCakeTotalSupply = await getVeCakeTotalSupply()

  const [revShareApr, cakePoolEmission, totalCakeDistributed, cakeStats, gaugeTotalWeight] = await Promise.all([
    getRevShareEmissionApr(veCakeTotalSupply),
    getCakePoolEmission(),
    getCakeDistributed(),
    getCakeStats(),
    queryGaugeTotalVote(),
  ])

  const veCAKEApr = getVeCAKEPoolApr(cakePoolEmission, veCakeTotalSupply)
  const totalApr = revShareApr.plus(veCAKEApr).plus(BRIBE_APR)
  return {
    totalApr: parseFloat(totalApr.toString()),
    totalCakeDistributed: parseFloat(totalCakeDistributed.toString()),
    burned: 16_000_000_000,
    cakeStats,
    gaugeTotalWeight: gaugeTotalWeight.toString(),
    weeklyReward: 401644,
  } as CakeRelatedFigures
}

export async function queryGaugeTotalVote() {
  const client = getViemClients({ chainId: ChainId.BSC })
  const totalWeight = await client.readContract({
    abi: calcGaugesVotingABI,
    address: getCalcGaugesVotingAddress(ChainId.BSC),
    functionName: 'getTotalWeight',
    args: [true],
  })
  return formatEther(totalWeight)
}

async function getCakeStats() {
  const client = getViemClients({ chainId: ChainId.BSC })
  return fetchCakeStats(client)
}

async function getCakeDistributed() {
  const client = getViemClients({ chainId: ChainId.BSC })

  const cakePoolDistributed = await client.readContract({
    abi: revenueSharingPoolProxyABI,
    address: getRevenueSharingCakePoolAddress(ChainId.BSC),
    functionName: 'totalDistributed',
  })

  const veCakeDistributed = await client.readContract({
    abi: revenueSharingPoolProxyABI,
    address: getRevenueSharingVeCakeAddress(ChainId.BSC),
    functionName: 'totalDistributed',
  })

  return cakePoolDistributed + veCakeDistributed
}

async function getCakePoolEmission() {
  const client = getViemClients({ chainId: ChainId.BSC })
  return fetchCakePoolEmission(client, ChainId.BSC)
}

function getVeCAKEPoolApr(cakePoolEmission: BigNumber, totalSupply: BigNumber) {
  return new BigNumber(new BigNumber(cakePoolEmission).div(3).times(24 * 60 * 60 * 365))
    .div(totalSupply.div(1e18))
    .times(100)
}

async function getRevShareEmissionApr(totalSupply: BigNumber) {
  const client = getViemClients({ chainId: ChainId.BSC })

  const totalDistributed = await client.readContract({
    abi: revenueSharingPoolProxyABI,
    address: getRevenueSharingVeCakeAddress(ChainId.BSC),
    functionName: 'totalDistributed',
  })
  const currentTimestamp = Math.floor(Date.now() / 1000)
  const lastThursday = Math.floor(currentTimestamp / WEEK) * WEEK
  const revShareEmission = new BigNumber(totalDistributed.toString()).dividedBy(lastThursday - 1700697600)
  return new BigNumber(revShareEmission)
    .times(24 * 60 * 60 * 365)
    .div(totalSupply)
    .times(100)
}

async function getVeCakeTotalSupply() {
  const client = getViemClients({ chainId: ChainId.BSC })
  const data = await client.readContract({
    abi: veCakeABI,
    functionName: 'totalSupply',
    address: getVeCakeAddress(ChainId.BSC),
  })

  return typeof data !== 'undefined' ? new BigNumber(data.toString()) : BIG_ZERO
}
