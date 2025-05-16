import { ChainId } from '@pancakeswap/chains'
import { getPredictionConfig } from '@pancakeswap/prediction'
import { fetchPredictionUsers } from 'state/predictions'
import { getProfile } from 'state/profile/helpers'
import { Profile } from 'state/types'

export async function queryPredictionUser() {
  const config = await getPredictionConfig(ChainId.BSC)
  const extra = config?.BNB ?? Object.values(config)?.[0]
  const result = await fetchPredictionUsers(
    {
      address: null,
      orderBy: 'totalBets',
      timePeriod: 'all',
    },
    extra,
  )
  const topUser = result.results
  const user = topUser[0]
  const profile = await getProfile(user.id)
  return {
    user,
    hasRegistered: Boolean(profile?.hasRegistered),
    profile: profile?.profile as Profile,
  }
}
