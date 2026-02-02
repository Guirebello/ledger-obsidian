# Tasks: Category Snapshot Dashboard

## Relevant Files

- `src/settings.ts` - Add `visibleSnapshotCategories` to ISettings interface
- `src/balance-utils.ts` - Add utilities to get current balances for categories
- `src/ui/CategoryCard.tsx` - New component: individual category card with chart
- `src/ui/CategorySnapshot.tsx` - New component: grid section containing all category cards
- `src/ui/LedgerDashboard.tsx` - Integration point, add CategorySnapshot above temporal views
- `src/ui/SharedStyles.tsx` - Reference for existing styled-components patterns
- `src/ui/NetWorthVisualization.tsx` - Reference for Chartist integration patterns
- `src/ui/AccountVisualization.tsx` - Reference for Chartist integration patterns
- `src/parser.ts` - TransactionCache type and categorized account lists

### Notes

- Unit tests should typically be placed alongside the code files they are testing
- Use `yarn test` to run tests
- Use `yarn dev` for watch mode during development

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Update the file after completing each sub-task, not just after completing an entire parent task.

## Tasks

- [x] 0.0 Create feature branch
  - [x] 0.1 Create and checkout new branch: `git checkout -b feature/category-snapshot-dashboard`

- [x] 1.0 Extend settings to support category visibility toggles
  - [x] 1.1 Read `src/settings.ts` to understand current ISettings interface
  - [x] 1.2 Add `visibleSnapshotCategories: string[]` property to ISettings
  - [x] 1.3 Add default value: `['Assets', 'Liabilities', 'Income', 'Expenses']`
  - [x] 1.4 Ensure settings migration handles existing users (no visibleSnapshotCategories)

- [x] 2.0 Create balance calculation utilities for current snapshot
  - [x] 2.1 Read `src/balance-utils.ts` to understand existing patterns
  - [x] 2.2 Create `getCurrentBalance(account, dailyAccountBalanceMap)` - returns latest balance for single account
  - [x] 2.3 Create `getTopLevelAccountsWithBalances(categoryAccounts, dailyAccountBalanceMap)` - returns array of {name, balance} for top-level accounts
  - [x] 2.4 Create `getCategoryTotal(topLevelAccounts)` - sums balances from top-level accounts

- [x] 3.0 Create CategoryCard component (card + donut chart + empty state)
  - [x] 3.1 Read `NetWorthVisualization.tsx` and `AccountVisualization.tsx` for Chartist patterns
  - [x] 3.2 Create `src/ui/CategoryCard.tsx` with styled card container (border, shadow, padding)
  - [x] 3.3 Implement card header: category name + total balance (formatted with currency symbol)
  - [x] 3.4 Implement donut chart using Chartist showing top-level account proportions
  - [x] 3.5 Implement accounts list showing each top-level account name and balance
  - [x] 3.6 Implement empty state: "No data available" message when category has no accounts
  - [x] 3.7 Define distinct color constants for each category (Assets, Liabilities, Income, Expenses)

- [x] 4.0 Create CategorySnapshot section component (grid of 4 cards)
  - [x] 4.1 Create `src/ui/CategorySnapshot.tsx` component file
  - [x] 4.2 Implement 2x2 responsive grid layout using styled-components
  - [x] 4.3 Filter categories based on `visibleSnapshotCategories` from settings
  - [x] 4.4 Map each visible category to CategoryCard with appropriate data

- [x] 5.0 Add toggle controls UI for category visibility
  - [x] 5.1 Add toggle switches/checkboxes above or within CategorySnapshot section
  - [x] 5.2 Wire toggle state to settings `visibleSnapshotCategories`
  - [x] 5.3 Call settings save on toggle change to persist state

- [x] 6.0 Integrate CategorySnapshot into LedgerDashboard
  - [x] 6.1 Import CategorySnapshot into `LedgerDashboard.tsx`
  - [x] 6.2 Add CategorySnapshot component above existing `NetWorthVisualization` / `AccountVisualization`
  - [x] 6.3 Pass required props: txCache, settings, dailyAccountBalanceMap, updater (for settings save)

- [ ] 7.0 Testing and verification
  - [ ] 7.1 Run `yarn dev` and verify section renders with sample ledger data
  - [ ] 7.2 Verify displayed balances match expected values from ledger file
  - [ ] 7.3 Toggle categories off/on, reload plugin, verify state persists
  - [ ] 7.4 Test with empty category (no accounts) - verify fallback UI shows
  - [x] 7.5 Run `yarn test` to check for regressions
  - [x] 7.6 Run `yarn eslint` and `yarn prettier` to ensure code quality
