import { getTopLevelAccountsWithBalances } from '../balance-utils';
import { LedgerModifier } from '../file-interface';
import type { TransactionCache } from '../parser';
import { ISettings } from '../settings';
import { CategoryCard, CategoryType } from './CategoryCard';
import React from 'react';
import styled from 'styled-components';

const ALL_CATEGORIES: CategoryType[] = [
  'Assets',
  'Liabilities',
  'Income',
  'Expenses',
];

const SnapshotContainer = styled.div`
  margin-bottom: 24px;
`;

const SnapshotHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const Title = styled.h2`
  margin: 0;
`;

const ToggleContainer = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const ToggleLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  font-size: 0.9em;
  color: var(--text-muted);

  &:hover {
    color: var(--text-normal);
  }
`;

const ToggleCheckbox = styled.input`
  cursor: pointer;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const getCategoryAccounts = (
  category: CategoryType,
  txCache: TransactionCache,
): string[] => {
  switch (category) {
    case 'Assets':
      return txCache.assetAccounts;
    case 'Liabilities':
      return txCache.liabilityAccounts;
    case 'Income':
      return txCache.incomeAccounts;
    case 'Expenses':
      return txCache.expenseAccounts;
    default:
      return [];
  }
};

export const CategorySnapshot: React.FC<{
  txCache: TransactionCache;
  settings: ISettings;
  dailyAccountBalanceMap: Map<string, Map<string, number>>;
  updater: LedgerModifier;
}> = ({ txCache, settings, dailyAccountBalanceMap, updater }): JSX.Element => {
  const visibleCategories =
    settings.visibleSnapshotCategories || ALL_CATEGORIES;

  const handleToggle = (category: CategoryType): void => {
    const newVisible = visibleCategories.includes(category)
      ? visibleCategories.filter((c) => c !== category)
      : [...visibleCategories, category];

    updater.updateSettings({ visibleSnapshotCategories: newVisible });
  };

  const visibleCategorySet = new Set(visibleCategories);

  return (
    <SnapshotContainer>
      <SnapshotHeader>
        <Title>Financial Snapshot</Title>
        <ToggleContainer>
          {ALL_CATEGORIES.map((category) => (
            <ToggleLabel key={category}>
              <ToggleCheckbox
                type="checkbox"
                checked={visibleCategorySet.has(category)}
                onChange={() => handleToggle(category)}
              />
              {category}
            </ToggleLabel>
          ))}
        </ToggleContainer>
      </SnapshotHeader>

      <Grid>
        {ALL_CATEGORIES.filter((c) => visibleCategorySet.has(c)).map(
          (category) => {
            const categoryAccounts = getCategoryAccounts(category, txCache);
            const accountsWithBalances = getTopLevelAccountsWithBalances(
              categoryAccounts,
              dailyAccountBalanceMap,
              txCache.accounts,
            );

            return (
              <CategoryCard
                key={category}
                category={category}
                accounts={accountsWithBalances}
                currencySymbol={settings.currencySymbol}
              />
            );
          },
        )}
      </Grid>
    </SnapshotContainer>
  );
};
