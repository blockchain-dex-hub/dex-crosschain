import Token from 'views/V3Info/views/TokenPage'
import { GetStaticPaths, GetStaticProps } from 'next'
import { InfoPageLayout } from 'views/V3Info/components/Layout'
import { getTokenStaticPaths, getTokenStaticProps } from 'utils/pageUtils'
import { Suspense } from 'react'
import { Flex, Spinner } from '@pancakeswap/uikit'

const TokenPage = ({ address }: { address: string }) => {
  if (!address) {
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
      <Token address={String(address).toLowerCase()} />
    </Suspense>
  )
}

TokenPage.Layout = InfoPageLayout
TokenPage.chains = [] // set all

export default TokenPage

export const getStaticPaths: GetStaticPaths = getTokenStaticPaths()

export const getStaticProps: GetStaticProps = getTokenStaticProps()
