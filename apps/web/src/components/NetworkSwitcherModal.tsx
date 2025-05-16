import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  Box,
  Button,
  Flex,
  InfoIcon,
  ModalCloseButton,
  ModalHeader,
  ModalTitle,
  ModalV2,
  ModalWrapper,
  Text,
  useMatchBreakpoints,
  UserMenuDivider,
  UserMenuItem,
  useTooltip,
} from '@pancakeswap/uikit'
import { useActiveChainId, useLocalNetworkChain } from 'hooks/useActiveChainId'
import { useHover } from 'hooks/useHover'
import { useSwitchNetwork } from 'hooks/useSwitchNetwork'
import useTheme from 'hooks/useTheme'
import { atom, useAtom } from 'jotai'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { useUserShowTestnet } from 'state/user/hooks/useUserShowTestnet'
import { chainNameConverter } from 'utils/chainNameConverter'
import { chains as evmChains } from 'utils/wagmi'
import { useAccount } from 'wagmi'
import { ChainLogo } from './Logo/ChainLogo'

// Network Switcher Modal
export const networkSwitcherModalAtom = atom(false)

interface NetworkSelectProps {
  switchNetwork: (chainId: number) => void
  chainId: number
  isWrongNetwork: boolean
  onDismiss: () => void
}

const NetworkSelect = ({ switchNetwork, chainId, isWrongNetwork, onDismiss }: NetworkSelectProps) => {
  const { t } = useTranslation()
  const [showTestnet] = useUserShowTestnet()
  const { theme } = useTheme()
  const { isMobile } = useMatchBreakpoints()
  return (
    <Box borderRadius={isMobile ? '32px' : '32px 32px 0 0'} overflow="hidden">
      <ModalHeader background={theme.colors.gradientCardHeader}>
        <ModalTitle>
          <Text bold fontSize="20px">
            {t('Select a Network')}
          </Text>
        </ModalTitle>
        <ModalCloseButton onDismiss={onDismiss} />
      </ModalHeader>
      <Box maxHeight="70vh" overflow="auto" padding="16px 0">
        {evmChains
          .filter((chain) => {
            if (chain.id === chainId) return true
            if ('testnet' in chain && chain.testnet && chain.id !== ChainId.MONAD_TESTNET) {
              return showTestnet
            }
            return true
          })
          .map((chain) => (
            <UserMenuItem
              key={chain.id}
              style={{ justifyContent: 'flex-start', cursor: 'pointer', padding: '0px 24px' }}
              onClick={() => {
                if (chain.id !== chainId || isWrongNetwork) {
                  switchNetwork(chain.id)
                }
                onDismiss()
              }}
            >
              <ChainLogo chainId={chain.id} />
              <Text
                color={chain.id === chainId && !isWrongNetwork ? 'secondary' : 'text'}
                bold={chain.id === chainId && !isWrongNetwork}
                pl="12px"
              >
                {chainNameConverter(chain.name)}
              </Text>
            </UserMenuItem>
          ))}
      </Box>
    </Box>
  )
}

interface WrongNetworkSelectProps {
  switchNetwork: (chainId: number) => void
  chainId: number
  onDismiss: () => void
}

const WrongNetworkSelect = ({ switchNetwork, chainId, onDismiss }: WrongNetworkSelectProps) => {
  const { t } = useTranslation()
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t(
      'The URL you are accessing (Chain id: %chainId%) belongs to %network%; mismatching your wallet’s network. Please switch the network to continue.',
      {
        chainId,
        network: evmChains.find((c) => c.id === chainId)?.name ?? 'Unknown network',
      },
    ),
    {
      placement: 'auto-start',
      hideTimeout: 0,
    },
  )
  const { chain } = useAccount()
  const localChainId = useLocalNetworkChain() || ChainId.BSC

  const localChainName = evmChains.find((c) => c.id === localChainId)?.name ?? 'BSC'

  const [ref1, isHover] = useHover<HTMLButtonElement>()

  return (
    <>
      <Flex ref={targetRef} alignItems="center" px="16px" py="8px">
        <InfoIcon color="textSubtle" />
        <Text color="textSubtle" pl="6px">
          {t('Please switch network')}
        </Text>
      </Flex>
      {tooltipVisible && tooltip}
      <UserMenuDivider />
      {chain && (
        <UserMenuItem ref={ref1} style={{ justifyContent: 'flex-start' }}>
          <ChainLogo chainId={chain.id} />
          <Text color="secondary" bold pl="12px">
            {chainNameConverter(chain.name)}
          </Text>
        </UserMenuItem>
      )}
      <Box px="16px" pt="8px">
        {isHover ? <ArrowUpIcon color="text" /> : <ArrowDownIcon color="text" />}
      </Box>
      <UserMenuItem
        onClick={() => {
          switchNetwork(localChainId)
          onDismiss()
        }}
        style={{ justifyContent: 'flex-start' }}
      >
        <ChainLogo chainId={localChainId} />
        <Text pl="12px">{chainNameConverter(localChainName)}</Text>
      </UserMenuItem>
      <Button
        mx="16px"
        my="8px"
        scale="sm"
        onClick={() => {
          switchNetwork(localChainId)
          onDismiss()
        }}
      >
        {t('Switch network in wallet')}
      </Button>
    </>
  )
}

export const NetworkSwitcherModal = () => {
  const { chainId, isWrongNetwork, isNotMatched } = useActiveChainId()
  const { switchNetworkAsync } = useSwitchNetwork()
  const router = useRouter()
  const [isOpen, setIsOpen] = useAtom(networkSwitcherModalAtom)

  const handleDismiss = useCallback(() => {
    setIsOpen(false)
  }, [])

  if (!chainId || router.pathname.includes('/info')) {
    return null
  }

  return (
    <ModalV2 isOpen={isOpen} onDismiss={handleDismiss} closeOnOverlayClick>
      <ModalWrapper minWidth="360px" maxHeight="90vh" style={{ overflowY: 'auto' }}>
        {isNotMatched ? (
          <WrongNetworkSelect switchNetwork={switchNetworkAsync} chainId={chainId} onDismiss={handleDismiss} />
        ) : (
          <NetworkSelect
            switchNetwork={switchNetworkAsync}
            chainId={chainId}
            isWrongNetwork={isWrongNetwork}
            onDismiss={handleDismiss}
          />
        )}
      </ModalWrapper>
    </ModalV2>
  )
}
