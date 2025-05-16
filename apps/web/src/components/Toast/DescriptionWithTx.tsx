import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { BscScanIcon, BscTraceIcon, Link, Text } from '@pancakeswap/uikit'
import truncateHash from '@pancakeswap/utils/truncateHash'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useMemo } from 'react'
import { getBlockExploreLink, getBlockExploreName } from 'utils'

interface DescriptionWithTxProps {
  description?: string
  txHash?: string
  txChainId?: number
  bscTrace?: boolean
}

const DescriptionWithTx: React.FC<React.PropsWithChildren<DescriptionWithTxProps>> = ({
  txHash,
  txChainId,
  children,
  bscTrace,
}) => {
  const { chainId } = useActiveChainId()
  const { t } = useTranslation()
  const explorerName = useMemo(() => {
    if (!bscTrace) return getBlockExploreName(txChainId || chainId)
    return 'BscTrace'
  }, [bscTrace, chainId, txChainId])
  const explorerLink = useMemo(() => {
    const link = getBlockExploreLink(txHash, 'transaction', txChainId || chainId)
    if (bscTrace) {
      return link.replace('bscscan.com', 'bsctrace.com')
    }
    return link
  }, [bscTrace, chainId, txChainId, txHash])

  return (
    <>
      {typeof children === 'string' ? <Text as="p">{children}</Text> : children}
      {txHash && (
        <Link external href={explorerLink}>
          {t('View on %site%', { site: explorerName })}: {truncateHash(txHash, 8, 0)}
          {(txChainId || chainId) === ChainId.BSC && bscTrace ? (
            <BscTraceIcon color="primary" ml="4px" />
          ) : (
            <BscScanIcon color="primary" ml="4px" />
          )}
        </Link>
      )}
    </>
  )
}

export default DescriptionWithTx
