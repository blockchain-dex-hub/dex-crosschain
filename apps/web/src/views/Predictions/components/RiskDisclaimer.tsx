import { useEffect, memo, useCallback } from 'react'
import { useModal } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import DisclaimerModal from 'components/DisclaimerModal'
import { useUserPredictionAcceptedRisk } from 'state/user/hooks'

function RiskDisclaimer() {
  const [hasAcceptedRisk, setHasAcceptedRisk] = useUserPredictionAcceptedRisk()
  const { t } = useTranslation()

  const handleSuccess = useCallback(() => {
    setHasAcceptedRisk(true)
  }, [setHasAcceptedRisk])

  const [onPresentRiskDisclaimer, onDismiss] = useModal(
    <DisclaimerModal
      id="predictions-risk-disclaimer"
      subtitle={t('Once you enter a position, you cannot cancel or adjust it.')}
      checks={[
        {
          key: 'responsibility-checkbox',
          content: t(
            'I understand that I am using this product at my own risk. Any losses incurred due to my actions are my own responsibility.',
          ),
        },
      ]}
      onSuccess={handleSuccess}
    />,
    false,
  )

  useEffect(() => {
    if (!hasAcceptedRisk) {
      onPresentRiskDisclaimer()
    }

    return onDismiss
  }, [onDismiss, onPresentRiskDisclaimer, hasAcceptedRisk])

  return null
}

export default memo(RiskDisclaimer)
