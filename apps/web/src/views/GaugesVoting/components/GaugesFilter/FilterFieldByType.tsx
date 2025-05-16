import { useTranslation } from '@pancakeswap/localization'
import { AutoColumn, Button, FlexGap, Select, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import React, { useMemo, useState } from 'react'
import styled from 'styled-components'
import { FilterModal } from './FilterModal'
import { Filter, FilterValue, OptionsType } from './type'

const FilterButton = styled(Button)`
  height: 35px;
  border-radius: 18px;
  padding: 0 12px;
  white-space: nowrap;
`

type FilterButtonGroupProps = {
  onFilterChange: (type: OptionsType, value: FilterValue) => void
  value: Filter
}

export const FilterFieldByTypeMobile: React.FC<FilterButtonGroupProps> = ({ onFilterChange, value }) => {
  const { t } = useTranslation()
  const [option, setOption] = useState<OptionsType | null>(null)

  const SORT_OPTIONS: Array<{ label: string; value: OptionsType }> = useMemo(
    () => [
      { label: t('Chain'), value: OptionsType.ByChain },
      { label: t('Fee Tier'), value: OptionsType.ByFeeTier },
      { label: t('Type'), value: OptionsType.ByType },
    ],
    [t],
  )

  return (
    <AutoColumn gap="4px">
      <Text fontSize={12} fontWeight={600} color="textSubtle" textTransform="uppercase">
        {t('filter')}
      </Text>
      <Select
        style={{ minWidth: '100px' }}
        placeHolderText={t('Chains,Fee Tiers...')}
        options={SORT_OPTIONS}
        onOptionChange={(opt) => setOption(opt.value)}
      />
      <FilterModal
        isOpen={Boolean(option)}
        onDismiss={() => setOption(null)}
        type={option}
        options={value}
        onChange={onFilterChange}
      />
    </AutoColumn>
  )
}

export const FilterFieldByType: React.FC<FilterButtonGroupProps> = ({ onFilterChange, value }) => {
  const { t } = useTranslation()
  const [option, setOption] = useState<OptionsType | null>(null)
  const { isSm } = useMatchBreakpoints()

  return (
    <>
      <AutoColumn gap="4px">
        <Text fontSize={12} fontWeight={600} color="textSubtle" textTransform="uppercase">
          {t('filter')}
        </Text>
        <FlexGap gap={isSm ? '0' : '10px'} justifyContent={isSm ? 'space-between' : 'flex-start'}>
          <FilterButton variant="light" onClick={() => setOption(OptionsType.ByChain)}>
            {t('Chain')}
          </FilterButton>
          <FilterButton variant="light" onClick={() => setOption(OptionsType.ByFeeTier)}>
            {t('Fee Tier')}
          </FilterButton>
          <FilterButton variant="light" onClick={() => setOption(OptionsType.ByType)}>
            {t('Type')}
          </FilterButton>
        </FlexGap>
      </AutoColumn>
      <FilterModal
        isOpen={Boolean(option)}
        onDismiss={() => setOption(null)}
        type={option}
        options={value}
        onChange={onFilterChange}
      />
    </>
  )
}
