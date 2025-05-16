const docLangCodeMapping: Record<string, string> = {
  vi: 'vietnamese',
}

export const getDocLink = (code: string) =>
  docLangCodeMapping[code]
    ? `https://docs.pancakeswap.finance/v/${docLangCodeMapping[code]}/get-started/connection-guide`
    : `https://docs.pancakeswap.finance/get-started/connection-guide`
