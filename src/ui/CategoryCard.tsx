import { AccountWithBalance, getCategoryTotal } from '../balance-utils';
import { IPieChartOptions } from 'chartist';
import React from 'react';
import ChartistGraph from 'react-chartist';
import styled from 'styled-components';

export type CategoryType = 'Assets' | 'Liabilities' | 'Income' | 'Expenses';

const CATEGORY_COLORS: Record<CategoryType, string> = {
  Assets: '#4CAF50',
  Liabilities: '#F44336',
  Income: '#2196F3',
  Expenses: '#FF9800',
};

const Card = styled.div<{ $categoryColor: string }>`
  background: var(--background-primary);
  border: 1px solid var(--background-modifier-border);
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-top: 3px solid ${(props) => props.$categoryColor};
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const CategoryName = styled.h3`
  margin: 0;
  font-size: 1.1em;
  color: var(--text-normal);
`;

const TotalBalance = styled.span<{ $isNegative: boolean }>`
  font-weight: bold;
  font-size: 1.2em;
  color: ${(props) =>
    props.$isNegative ? 'var(--text-error)' : 'var(--text-normal)'};
`;

const ChartContainer = styled.div`
  height: 120px;
  margin: 8px 0;

  .ct-chart-pie .ct-label {
    display: none;
  }

  .ct-series-a .ct-slice-donut {
    stroke: var(--interactive-accent);
  }
  .ct-series-b .ct-slice-donut {
    stroke: var(--text-accent);
  }
  .ct-series-c .ct-slice-donut {
    stroke: var(--text-muted);
  }
  .ct-series-d .ct-slice-donut {
    stroke: var(--background-modifier-border-hover);
  }
  .ct-series-e .ct-slice-donut {
    stroke: var(--interactive-accent-hover);
  }
`;

const AccountList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 12px 0 0 0;
  max-height: 150px;
  overflow-y: auto;
`;

const AccountItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  font-size: 0.9em;
  border-bottom: 1px solid var(--background-modifier-border);

  &:last-child {
    border-bottom: none;
  }
`;

const AccountName = styled.span`
  color: var(--text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 60%;
`;

const AccountBalance = styled.span<{ $isNegative: boolean }>`
  color: ${(props) =>
    props.$isNegative ? 'var(--text-error)' : 'var(--text-normal)'};
  font-family: var(--font-monospace);
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 24px;
  color: var(--text-muted);
  font-style: italic;
`;

const formatBalance = (amount: number, currencySymbol: string): string => {
  const absAmount = Math.abs(amount).toFixed(2);
  const formatted = absAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return amount < 0
    ? `-${currencySymbol}${formatted}`
    : `${currencySymbol}${formatted}`;
};

const getShortAccountName = (fullName: string): string => {
  const parts = fullName.split(':');
  return parts.length > 1 ? parts.slice(1).join(':') : fullName;
};

export const CategoryCard: React.FC<{
  category: CategoryType;
  accounts: AccountWithBalance[];
  currencySymbol: string;
}> = ({ category, accounts, currencySymbol }): JSX.Element => {
  const total = getCategoryTotal(accounts);
  const categoryColor = CATEGORY_COLORS[category];
  const hasData = accounts.length > 0 && accounts.some((a) => a.balance !== 0);

  if (!hasData) {
    return (
      <Card $categoryColor={categoryColor}>
        <CardHeader>
          <CategoryName>{category}</CategoryName>
          <TotalBalance $isNegative={false}>
            {formatBalance(0, currencySymbol)}
          </TotalBalance>
        </CardHeader>
        <EmptyState>No data available</EmptyState>
      </Card>
    );
  }

  const chartData = {
    series: accounts.map((a) => Math.abs(a.balance)),
  };

  const chartOptions: IPieChartOptions = {
    donut: true,
    donutWidth: 30,
    showLabel: false,
    height: '120px',
  };

  return (
    <Card $categoryColor={categoryColor}>
      <CardHeader>
        <CategoryName>{category}</CategoryName>
        <TotalBalance $isNegative={total < 0}>
          {formatBalance(total, currencySymbol)}
        </TotalBalance>
      </CardHeader>

      <ChartContainer>
        <ChartistGraph data={chartData} options={chartOptions} type="Pie" />
      </ChartContainer>

      <AccountList>
        {accounts
          .filter((a) => a.balance !== 0)
          .sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance))
          .map((account) => (
            <AccountItem key={account.name}>
              <AccountName title={account.name}>
                {getShortAccountName(account.name)}
              </AccountName>
              <AccountBalance $isNegative={account.balance < 0}>
                {formatBalance(account.balance, currencySymbol)}
              </AccountBalance>
            </AccountItem>
          ))}
      </AccountList>
    </Card>
  );
};
