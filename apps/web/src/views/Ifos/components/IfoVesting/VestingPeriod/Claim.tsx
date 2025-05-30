import { PoolIds } from '@pancakeswap/ifos'
import { useTranslation } from '@pancakeswap/localization'
import { AutoRenewIcon, Button, useToast } from '@pancakeswap/uikit'
import { useWeb3React } from '@pancakeswap/wagmi'
import { ToastDescriptionWithTx } from 'components/Toast'
import useCatchTxError from 'hooks/useCatchTxError'
import { useIfoV3Contract } from 'hooks/useContract'
import { useCallback, useMemo } from 'react'
import { Address } from 'viem'
import { VestingData } from 'views/Ifos/hooks/vesting/fetchUserWalletIfoData'

import { SwitchNetworkTips } from '../../IfoFoldableCard/IfoPoolCard/SwitchNetworkTips'

interface Props {
  poolId: PoolIds
  data: VestingData
  claimableAmount: string
  isVestingInitialized: boolean
  fetchUserVestingData: () => void
  enabled: boolean
}

const ClaimButton: React.FC<React.PropsWithChildren<Props>> = ({
  poolId,
  data,
  claimableAmount,
  isVestingInitialized,
  fetchUserVestingData,
  enabled,
}) => {
  const { account, chain } = useWeb3React()
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { address, token, chainId } = data.ifo
  const contract = useIfoV3Contract(address)
  const { fetchWithCatchTxError, loading: isPending } = useCatchTxError()

  const isReady = useMemo(() => {
    const checkClaimableAmount = isVestingInitialized ? claimableAmount === '0' : false
    return isPending || checkClaimableAmount
  }, [isPending, isVestingInitialized, claimableAmount])

  const handleClaim = useCallback(async () => {
    const { vestingId } = data.userVestingData[poolId]

    if (!account) return

    const methods = isVestingInitialized
      ? contract?.write.release([vestingId as Address], { account, chain })
      : contract?.write.harvestPool([poolId === PoolIds.poolBasic ? 0 : 1], { account, chain })
    const receipt = await fetchWithCatchTxError(() => {
      if (methods) {
        return methods
      }
      throw new Error('Invalid contract call')
    })

    if (receipt?.status) {
      toastSuccess(
        t('Success!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You have successfully claimed available tokens.')}
        </ToastDescriptionWithTx>,
      )
      fetchUserVestingData()
    }
  }, [
    data.userVestingData,
    poolId,
    isVestingInitialized,
    contract?.write,
    account,
    chain,
    fetchWithCatchTxError,
    toastSuccess,
    t,
    fetchUserVestingData,
  ])

  if (chain?.id !== chainId) {
    return <SwitchNetworkTips ifoChainId={chainId} />
  }

  return (
    <Button
      mt="20px"
      width="100%"
      onClick={handleClaim}
      isLoading={isPending}
      disabled={isReady && !enabled}
      endIcon={isPending ? <AutoRenewIcon spin color="currentColor" /> : null}
    >
      {t('Claim')}
    </Button>
  )
}

export default ClaimButton
