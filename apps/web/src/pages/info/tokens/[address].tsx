import { GetStaticPaths, GetStaticProps } from 'next'
import { getTokenStaticPaths, getTokenStaticProps, invalidAddressCheck } from 'utils/pageUtils'
import { InfoPageLayout } from 'views/Info'
import Token from 'views/Info/Tokens/TokenPage'
import { Suspense } from 'react'
import { Flex, Spinner } from '@pancakeswap/uikit'

const TokenPage = ({ address }: { address: string }) => {
  if (invalidAddressCheck(String(address))) {
    return null
  }

  return (
    <Suspense
      fallback={
        <Flex mt="80px" justifyContent="center">
          <Spinner />
        </Flex>
      }
    >
      <Token routeAddress={address} />
    </Suspense>
  )
}

TokenPage.Layout = InfoPageLayout
TokenPage.chains = [] // set all

export default TokenPage

export const getStaticPaths: GetStaticPaths = getTokenStaticPaths()

export const getStaticProps: GetStaticProps = getTokenStaticProps()
