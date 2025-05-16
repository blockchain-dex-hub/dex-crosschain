import { getTotalTvl } from 'utils/getTotalTVL'
import { SiteStats } from './types'

export async function querySiteStats() {
  const results = await getTotalTvl()

  return {
    totalUsers: results.addressCount30Days,
    totalTrades: results.totalTx30Days,
    totalValueLocked: results.tvl,
    community: 2_400_000,
  } as SiteStats
}
