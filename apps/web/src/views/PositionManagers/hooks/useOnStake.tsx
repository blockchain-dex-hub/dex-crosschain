import { useTranslation } from '@pancakeswap/localization'
import { MANAGER } from '@pancakeswap/position-managers'
import { Currency, CurrencyAmount } from '@pancakeswap/sdk'
import { useToast } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { ToastDescriptionWithTx } from 'components/Toast'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useCatchTxError from 'hooks/useCatchTxError'
import { usePositionManagerBCakeWrapperContract, usePositionManagerWrapperContract } from 'hooks/useContract'
import { useCallback } from 'react'
import { Address } from 'viem'
import { usePMSlippage } from './usePMSlippage'

export const useOnStake = (
  managerId: MANAGER,
  contractAddress: Address,
  bCakeWrapperAddress?: Address,
  isDisabled?: boolean,
) => {
  const positionManagerBCakeWrapperContract = usePositionManagerBCakeWrapperContract(bCakeWrapperAddress ?? '0x')
  const positionManagerWrapperContract = usePositionManagerWrapperContract(contractAddress)
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { toastSuccess } = useToast()
  const { chain, account } = useActiveWeb3React()
  const { t } = useTranslation()
  const slippage = usePMSlippage(bCakeWrapperAddress)

  const mintThenDeposit = useCallback(
    async (
      amountA: CurrencyAmount<Currency>,
      amountB: CurrencyAmount<Currency>,
      allowDepositToken0: boolean,
      allowDepositToken1: boolean,
      onDone?: () => void,
    ) => {
      const receipt = await fetchWithCatchTxError(
        bCakeWrapperAddress
          ? async () => {
              const message = managerId === MANAGER.TEAHOUSE ? slippage : '0x'
              const estGas = await positionManagerBCakeWrapperContract.estimateGas.mintThenDeposit(
                [
                  allowDepositToken0 ? amountA?.numerator ?? 0n : 0n,
                  allowDepositToken1 ? amountB?.numerator ?? 0n : 0n,
                  false,
                  message,
                ],
                {
                  account: account ?? '0x',
                },
              )

              return positionManagerBCakeWrapperContract.write.mintThenDeposit(
                [
                  allowDepositToken0 ? amountA?.numerator ?? 0n : 0n,
                  allowDepositToken1 ? amountB?.numerator ?? 0n : 0n,
                  false,
                  message,
                ],
                {
                  account: account ?? '0x',
                  chain,
                  gas: BigInt(new BigNumber(estGas.toString()).times(1.5).toNumber().toFixed(0)),
                },
              )
            }
          : async () =>
              positionManagerWrapperContract.write.mintThenDeposit(
                [
                  allowDepositToken0 ? amountA?.numerator ?? 0n : 0n,
                  allowDepositToken1 ? amountB?.numerator ?? 0n : 0n,
                  '0x',
                ],
                {
                  account: account ?? '0x',
                  chain,
                },
              ),
      )

      if (receipt?.status) {
        toastSuccess(
          `${t('Staked')}!`,
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('Your funds have been staked in position manager.')}
          </ToastDescriptionWithTx>,
        )
        onDone?.()
      }
    },
    [
      fetchWithCatchTxError,
      bCakeWrapperAddress,
      managerId,
      positionManagerBCakeWrapperContract.estimateGas,
      positionManagerBCakeWrapperContract.write,
      account,
      chain,
      positionManagerWrapperContract.write,
      toastSuccess,
      slippage,
      t,
    ],
  )

  const onUpdate = useCallback(
    async (onDone?: () => void) => {
      const receipt = await fetchWithCatchTxError(
        bCakeWrapperAddress
          ? async () =>
              positionManagerBCakeWrapperContract.write.deposit([0n, true], {
                account: account ?? '0x',
                chain,
              })
          : async () =>
              positionManagerWrapperContract.write.deposit([0n], {
                account: account ?? '0x',
                chain,
              }),
      )

      if (receipt?.status) {
        toastSuccess(
          `${t('Booster Update')}!`,
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('Booster has been updated.')}
          </ToastDescriptionWithTx>,
        )
        onDone?.()
      }
    },
    [
      fetchWithCatchTxError,
      bCakeWrapperAddress,
      positionManagerBCakeWrapperContract.write,
      account,
      chain,
      positionManagerWrapperContract.write,
      toastSuccess,
      t,
    ],
  )

  return {
    onStake: isDisabled ? undefined : mintThenDeposit,
    onUpdate,
    isTxLoading: pendingTx,
  }
}
