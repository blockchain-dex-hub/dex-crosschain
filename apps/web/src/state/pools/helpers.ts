import { DeserializedPool } from '@pancakeswap/pools'
import { Token } from '@pancakeswap/sdk'
import { deserializeToken } from '@pancakeswap/token-lists'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import {
  DeserializedCakeVault,
  SerializedCakeVault,
  SerializedLockedCakeVault,
  SerializedPool,
  VaultKey,
} from 'state/types'
import { safeGetAddress } from 'utils'
import { convertSharesToCake } from 'views/Pools/helpers'

type UserData =
  | DeserializedPool<Token>['userData']
  | {
      allowance: number | string
      stakingTokenBalance: number | string
      stakedBalance: number | string
      pendingReward: number | string
    }

export const transformUserData = (userData: UserData) => {
  return {
    allowance: userData?.allowance ? new BigNumber(userData.allowance) : BIG_ZERO,
    stakingTokenBalance: userData?.stakingTokenBalance ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO,
    stakedBalance: userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO,
    pendingReward: userData?.pendingReward ? new BigNumber(userData.pendingReward) : BIG_ZERO,
  }
}

const transformProfileRequirement = (profileRequirement?: { required: boolean; thresholdPoints: string }) => {
  return profileRequirement
    ? {
        required: profileRequirement.required,
        thresholdPoints: profileRequirement.thresholdPoints
          ? new BigNumber(profileRequirement.thresholdPoints)
          : BIG_ZERO,
      }
    : undefined
}

export const transformPool = (pool: SerializedPool): DeserializedPool<Token> => {
  const {
    totalStaked,
    stakingLimit,
    numberSecondsForUserLimit,
    userData,
    stakingToken,
    earningToken,
    profileRequirement,
    startTimestamp,
    ...rest
  } = pool

  return {
    ...rest,
    startTimestamp,
    profileRequirement: transformProfileRequirement(profileRequirement),
    stakingToken: deserializeToken(stakingToken),
    earningToken: deserializeToken(earningToken),
    userData: transformUserData(userData),
    totalStaked: new BigNumber(totalStaked || '0'),
    stakingLimit: new BigNumber(stakingLimit || '0'),
    stakingLimitEndTimestamp: (numberSecondsForUserLimit || 0) + (startTimestamp || 0),
  }
}

export const transformVault = (vaultKey: VaultKey, vault: SerializedCakeVault): DeserializedCakeVault => {
  const {
    totalShares: totalSharesAsString,
    pricePerFullShare: pricePerFullShareAsString,
    fees: { performanceFee, withdrawalFee, withdrawalFeePeriod },
    userData: {
      isLoading,
      userShares: userSharesAsString,
      cakeAtLastUserAction: cakeAtLastUserActionAsString,
      lastDepositedTime,
      lastUserActionTime,
    },
  } = vault

  const totalShares = totalSharesAsString ? new BigNumber(totalSharesAsString) : BIG_ZERO
  const pricePerFullShare = pricePerFullShareAsString ? new BigNumber(pricePerFullShareAsString) : BIG_ZERO
  const userShares = new BigNumber(userSharesAsString)
  const cakeAtLastUserAction = new BigNumber(cakeAtLastUserActionAsString)
  let userDataExtra
  let publicDataExtra
  if (vaultKey === VaultKey.CakeVault) {
    const {
      totalCakeInVault: totalCakeInVaultAsString,
      totalLockedAmount: totalLockedAmountAsString,
      userData: {
        userBoostedShare: userBoostedShareAsString,
        lockEndTime,
        lockStartTime,
        locked,
        lockedAmount: lockedAmountAsString,
        currentOverdueFee: currentOverdueFeeAsString,
        currentPerformanceFee: currentPerformanceFeeAsString,
      },
    } = vault as SerializedLockedCakeVault

    const totalCakeInVault = new BigNumber(totalCakeInVaultAsString || '0')
    const totalLockedAmount = new BigNumber(totalLockedAmountAsString || '0')
    const lockedAmount = new BigNumber(lockedAmountAsString)
    const userBoostedShare = new BigNumber(userBoostedShareAsString)
    const currentOverdueFee = currentOverdueFeeAsString ? new BigNumber(currentOverdueFeeAsString) : BIG_ZERO
    const currentPerformanceFee = currentPerformanceFeeAsString
      ? new BigNumber(currentPerformanceFeeAsString)
      : BIG_ZERO

    const balance = convertSharesToCake(
      userShares,
      pricePerFullShare,
      undefined,
      undefined,
      currentOverdueFee.plus(currentPerformanceFee).plus(userBoostedShare),
    )
    userDataExtra = {
      lockEndTime,
      lockStartTime,
      locked,
      lockedAmount,
      userBoostedShare,
      currentOverdueFee,
      currentPerformanceFee,
      balance,
    }
    publicDataExtra = { totalLockedAmount, totalCakeInVault }
  } else {
    const balance = convertSharesToCake(userShares, pricePerFullShare)
    const { cakeAsBigNumber } = convertSharesToCake(totalShares, pricePerFullShare)
    userDataExtra = { balance }
    publicDataExtra = { totalCakeInVault: cakeAsBigNumber }
  }

  const performanceFeeAsDecimal = performanceFee && performanceFee / 100

  return {
    totalShares,
    pricePerFullShare,
    ...publicDataExtra,
    fees: { performanceFee, withdrawalFee, withdrawalFeePeriod, performanceFeeAsDecimal },
    userData: {
      isLoading,
      userShares,
      cakeAtLastUserAction,
      lastDepositedTime,
      lastUserActionTime,
      ...userDataExtra,
    },
  }
}

export const getTokenPricesFromFarm = (
  farms: {
    quoteToken: { address: string }
    token: { address: string }
    quoteTokenPriceBusd: string
    tokenPriceBusd: string
  }[],
) => {
  return farms.reduce((prices, farm) => {
    const quoteTokenAddress = safeGetAddress(farm.quoteToken.address)
    const tokenAddress = safeGetAddress(farm.token.address)
    /* eslint-disable no-param-reassign */
    if (quoteTokenAddress && !prices[quoteTokenAddress]) {
      prices[quoteTokenAddress] = new BigNumber(farm.quoteTokenPriceBusd).toNumber()
    }
    if (tokenAddress && !prices[tokenAddress]) {
      prices[tokenAddress] = new BigNumber(farm.tokenPriceBusd).toNumber()
    }
    /* eslint-enable no-param-reassign */
    return prices
  }, {})
}
