import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { CAKE } from '@pancakeswap/tokens'
import { AutoRow, BalanceInputProps, Button, Text } from '@pancakeswap/uikit'
import { getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import BN from 'bignumber.js'
import CurrencyInputPanelSimplify from 'components/CurrencyInputPanelSimplify'
import { useAtom, useAtomValue } from 'jotai'
import { useCallback, useMemo } from 'react'
import { cakeLockAmountAtom } from 'state/vecake/atoms'
import { useBSCCakeBalance } from '../hooks/useBSCCakeBalance'
import { useWriteApproveAndIncreaseLockAmountCallback } from '../hooks/useContractWrite'
import { LockCakeDataSet } from './DataSet'

const CakeInput: React.FC<{
  value: BalanceInputProps['value']
  onUserInput: BalanceInputProps['onUserInput']
  disabled?: boolean
}> = ({ value, onUserInput, disabled }) => {
  const { t } = useTranslation()

  const onInput = useCallback(
    (input: string) => {
      onUserInput(input === '.' ? '0.' : input)
    },
    [onUserInput],
  )

  return (
    <CurrencyInputPanelSimplify
      disabled={disabled}
      currency={CAKE[ChainId.BSC]}
      disableCurrencySelect
      id="staking-cake-add-amount"
      showUSDPrice
      showCommonBases
      showMaxButton={false}
      defaultValue={value?.toString()}
      onUserInput={onInput}
      title={
        <Text color="textSubtle" fontSize={12} bold>
          {t('CAKE Amount')}
        </Text>
      }
    />
  )
}

export const LockCakeForm: React.FC<{
  // show input field only
  fieldOnly?: boolean
  disabled?: boolean
  hideLockCakeDataSetStyle?: boolean
  customVeCakeCard?: null | JSX.Element
  onDismiss?: () => void
}> = ({ fieldOnly, disabled, customVeCakeCard, hideLockCakeDataSetStyle, onDismiss }) => {
  const [value, onChange] = useAtom(cakeLockAmountAtom)

  return (
    <AutoRow alignSelf="start">
      <CakeInput value={value} onUserInput={onChange} disabled={disabled} />

      {customVeCakeCard}

      {fieldOnly ? null : (
        <>
          {disabled ? null : <LockCakeDataSet hideLockCakeDataSetStyle={hideLockCakeDataSetStyle} />}

          <SubmitLockButton onDismiss={onDismiss} />
        </>
      )}
    </AutoRow>
  )
}

const SubmitLockButton = ({ onDismiss }: { onDismiss?: () => void }) => {
  const { t } = useTranslation()
  const _cakeBalance = useBSCCakeBalance()
  const cakeLockAmount = useAtomValue(cakeLockAmountAtom)
  const disabled = useMemo(
    () =>
      !cakeLockAmount || cakeLockAmount === '0' || getDecimalAmount(new BN(cakeLockAmount)).gt(_cakeBalance.toString()),
    [_cakeBalance, cakeLockAmount],
  )
  const increaseLockAmount = useWriteApproveAndIncreaseLockAmountCallback(onDismiss)

  return (
    <Button mt="16px" disabled={disabled} width="100%" onClick={increaseLockAmount}>
      {t('Add CAKE')}
    </Button>
  )
}
