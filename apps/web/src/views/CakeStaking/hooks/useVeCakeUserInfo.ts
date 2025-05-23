import { ChainId } from '@pancakeswap/chains'
import { useReadContract } from '@pancakeswap/wagmi'
import dayjs from 'dayjs'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useVeCakeContract } from 'hooks/useContract'
import { useCallback, useMemo } from 'react'
import { Address } from 'viem'
import { CakeLockStatus, CakePoolType } from '../types'
import { useCakePoolLockInfo } from './useCakePoolLockInfo'
import { useCheckIsUserAllowMigrate } from './useCheckIsUserAllowMigrate'
import { useCurrentBlockTimestamp } from './useCurrentBlockTimestamp'

export enum CakePoolLockStatus {
  LOCKING = 0,
  WITHDRAW = 1,
}

export type VeCakeUserInfo = {
  // cake amount locked by user
  amount: bigint
  // end time of user lock
  end: bigint
  // lock through cake pool proxy
  // will zeroAddress if not locked through cake pool proxy
  cakePoolProxy: Address
  // cake amount locked by cake pool proxy
  cakeAmount: bigint
  // lock end time of cake pool proxy
  lockEndTime: number
  // migration time of cake pool proxy
  migrationTime: number
  // cake pool type of cake pool proxy
  // 1: Migration
  // 2: Delegation
  cakePoolType: CakePoolType
  // withdraw flag of cake pool proxy
  // 0: not withdraw
  // 1: already withdraw
  withdrawFlag: CakePoolLockStatus
}

export const useVeCakeUserInfo = (
  targetChain?: ChainId,
): {
  data?: VeCakeUserInfo
  isLoading: boolean
  refetch: () => void
} => {
  const veCakeContract = useVeCakeContract(targetChain)
  const { account } = useAccountActiveChain()

  const { data, refetch, isLoading, isPending } = useReadContract({
    chainId: targetChain ?? veCakeContract?.chain?.id,
    abi: veCakeContract.abi,
    address: veCakeContract.address,
    functionName: 'getUserInfo',
    query: {
      enabled: Boolean(veCakeContract?.address && account),
      select: useCallback((d: readonly [bigint, bigint, `0x${string}`, bigint, number, number, number, number]) => {
        if (!d) return undefined
        const [amount, end, cakePoolProxy, cakeAmount, lockEndTime, migrationTime, cakePoolType, withdrawFlag] = d
        return {
          amount,
          end,
          cakePoolProxy,
          cakeAmount,
          lockEndTime,
          migrationTime,
          cakePoolType,
          withdrawFlag,
        } as VeCakeUserInfo
      }, []),
    },
    args: [account!],
    watch: true,
  })

  return {
    data,
    isLoading: isPending || isLoading,
    refetch,
  }
}

export const useCakeLockStatus = (
  targetChain?: ChainId,
): {
  status: CakeLockStatus
  shouldMigrate: boolean
  cakeLockedAmount: bigint
  nativeCakeLockedAmount: bigint
  proxyCakeLockedAmount: bigint
  cakeLocked: boolean
  cakeLockExpired: boolean
  cakePoolLocked: boolean
  cakePoolLockExpired: boolean
  cakeUnlockTime: number
  cakePoolUnlockTime: number
  delegated: boolean
} => {
  const currentTimestamp = useCurrentBlockTimestamp()
  const { data: userInfo } = useVeCakeUserInfo(targetChain)
  // if user locked at cakePool before, should migrate
  const cakePoolLockInfo = useCakePoolLockInfo(targetChain)

  const isAllowMigrate = useCheckIsUserAllowMigrate(String(cakePoolLockInfo.lockEndTime))

  const shouldMigrate = useMemo(() => {
    return cakePoolLockInfo?.locked && userInfo?.cakePoolType !== CakePoolType.MIGRATED && isAllowMigrate
  }, [cakePoolLockInfo?.locked, isAllowMigrate, userInfo?.cakePoolType])

  const delegateOnly = useMemo(() => {
    if (!userInfo) return false

    return userInfo.cakePoolType === CakePoolType.DELEGATED && userInfo.amount === 0n
  }, [userInfo])

  const now = useMemo(() => dayjs.unix(currentTimestamp), [currentTimestamp])

  const cakeLocked = useMemo(() => Boolean(userInfo && userInfo.amount > 0n), [userInfo])

  const cakeUnlockTime = useMemo(() => {
    if (!userInfo) return 0
    return Number(userInfo.end)
  }, [userInfo])

  const cakeLockExpired = useMemo(() => {
    if (!cakeLocked) return false
    return dayjs.unix(cakeUnlockTime).isBefore(now)
  }, [cakeLocked, cakeUnlockTime, now])

  const delegated = useMemo(() => userInfo?.cakePoolType === CakePoolType.DELEGATED, [userInfo])

  const cakePoolLocked = useMemo(
    () => !delegated && Boolean(userInfo?.cakeAmount) && userInfo?.withdrawFlag !== CakePoolLockStatus.WITHDRAW,
    [delegated, userInfo?.cakeAmount, userInfo?.withdrawFlag],
  )

  const cakePoolLockExpired = useMemo(() => {
    if (!cakePoolLocked) return false
    return currentTimestamp > userInfo!.lockEndTime
  }, [cakePoolLocked, currentTimestamp, userInfo])

  const nativeCakeLockedAmount = useMemo(() => {
    if (!userInfo) return BigInt(0)
    return userInfo.amount ?? 0n
  }, [userInfo])

  const proxyCakeLockedAmount = useMemo(() => {
    if (!cakePoolLocked || delegated) return 0n

    return userInfo?.cakeAmount ?? 0n
  }, [cakePoolLocked, delegated, userInfo?.cakeAmount])

  const cakeLockedAmount = useMemo(() => {
    return nativeCakeLockedAmount + proxyCakeLockedAmount
  }, [nativeCakeLockedAmount, proxyCakeLockedAmount])

  const cakePoolUnlockTime = useMemo(() => {
    if (!cakePoolLocked) return 0
    return Number(userInfo!.lockEndTime)
  }, [userInfo, cakePoolLocked])

  const status = useMemo(() => {
    if (((!userInfo || !userInfo.amount) && !cakePoolLocked && !shouldMigrate) || delegateOnly)
      return CakeLockStatus.NotLocked
    if (cakeLockExpired) return CakeLockStatus.Expired
    if ((userInfo?.amount && userInfo.end) || cakePoolLocked) return CakeLockStatus.Locking
    if (shouldMigrate) return CakeLockStatus.Migrate
    return CakeLockStatus.NotLocked
  }, [userInfo, cakePoolLocked, shouldMigrate, delegateOnly, cakeLockExpired])

  return {
    status,
    shouldMigrate,
    cakeLockedAmount,
    nativeCakeLockedAmount,
    proxyCakeLockedAmount,
    delegated,
    cakeLocked,
    cakeLockExpired,
    cakePoolLocked,
    cakePoolLockExpired,
    cakeUnlockTime,
    cakePoolUnlockTime,
  }
}
