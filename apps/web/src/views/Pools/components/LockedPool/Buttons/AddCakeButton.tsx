import { useTranslation } from '@pancakeswap/localization'
import { Button, ButtonProps, Skeleton, useModal } from '@pancakeswap/uikit'
import { memo, useCallback } from 'react'
import { usePool } from 'state/pools/hooks'
import NotEnoughTokensModal from '../../Modals/NotEnoughTokensModal'
import AddAmountModal from '../Modals/AddAmountModal'
import { AddButtonProps } from '../types'

interface AddButtonPropsType extends AddButtonProps, ButtonProps {}

const AddCakeButton: React.FC<React.PropsWithChildren<AddButtonPropsType>> = ({
  currentBalance,
  stakingToken,
  currentLockedAmount,
  lockEndTime,
  lockStartTime,
  stakingTokenBalance,
  stakingTokenPrice,
  customLockAmount,
  ...props
}) => {
  const { pool } = usePool(0)
  const userDataLoaded = pool?.userDataLoaded

  const { t } = useTranslation()

  const [openAddAmountModal] = useModal(
    stakingToken ? (
      <AddAmountModal
        currentLockedAmount={currentLockedAmount}
        currentBalance={currentBalance}
        stakingToken={stakingToken}
        lockStartTime={lockStartTime}
        lockEndTime={lockEndTime}
        stakingTokenBalance={stakingTokenBalance}
        stakingTokenPrice={stakingTokenPrice}
        customLockAmount={customLockAmount}
      />
    ) : null,
    true,
    true,
    'AddAmountModal',
  )

  const [onPresentTokenRequired] = useModal(
    <NotEnoughTokensModal tokenSymbol={stakingToken?.symbol || ''} tokenAddress={stakingToken?.address} />,
  )

  const handleClicked = useCallback(() => {
    return currentBalance.gt(0) ? openAddAmountModal() : onPresentTokenRequired()
  }, [currentBalance, openAddAmountModal, onPresentTokenRequired])

  return userDataLoaded ? (
    <Button
      onClick={handleClicked}
      width="100%"
      style={{ whiteSpace: 'nowrap', paddingLeft: 0, paddingRight: 0 }}
      {...props}
    >
      {t('Add CAKE')}
    </Button>
  ) : (
    <Skeleton height={48} />
  )
}

export default memo(AddCakeButton)
