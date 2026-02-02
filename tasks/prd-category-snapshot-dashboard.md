# PRD: Category Snapshot Dashboard

## Introduction/Overview

Add a new section to the existing dashboard that displays the **current state** of the user's finances across the four main account categories: Assets, Expenses, Income, and Liabilities. Unlike the existing temporal views (charts over time), this provides an at-a-glance snapshot showing total balances and top-level account breakdowns for each category.

**Problem solved:** Users currently need to navigate through temporal charts or manually calculate totals to understand their current financial position. This feature provides immediate visibility into current balances without date range context.

## Goals

1. Display current total balance for each of the 4 categories (Assets, Expenses, Income, Liabilities)
2. Show top-level accounts with their balances under each category
3. Provide visual representation combining cards and charts
4. Allow users to toggle which categories are visible
5. Integrate seamlessly into existing dashboard layout

## User Stories

1. **As a user**, I want to see my current total assets at a glance so I know my overall financial position.
2. **As a user**, I want to see top-level account breakdowns (e.g., Checking, Savings under Assets) to understand where my money is distributed.
3. **As a user**, I want to toggle off categories I don't care about (e.g., hide Liabilities if I have none).
4. **As a user**, I want both numeric totals and a visual chart showing proportions within each category.

## Functional Requirements

1. **Category Cards**: Display one card per visible category (Assets, Expenses, Income, Liabilities)
   - Each card shows category name and total balance
   - Each card lists top-level accounts with individual balances
   - Cards use existing currency symbol from settings

2. **Category Charts**: Include a donut/pie chart per category showing proportion of top-level accounts
   - Chart appears alongside or within the card
   - Use existing Chartist library for consistency

3. **Toggle Controls**: Provide UI to show/hide each category
   - Default: all 4 categories visible (regardless of data)
   - Persist toggle state in plugin settings
   - Toggle UI can be checkboxes or toggle switches

4. **Data Source**: Use latest balance data from TransactionCache
   - Calculate current balance (not filtered by date range)
   - Leverage existing `txCache.assetAccounts`, `txCache.liabilityAccounts`, `txCache.expenseAccounts`, `txCache.incomeAccounts`

5. **Layout**: Add section within existing DesktopDashboard
   - Position **above** the existing temporal visualizations
   - Responsive grid layout for the 4 cards (2x2 or 1x4 depending on space)

6. **Static Display**: View-only, no interactivity beyond toggle controls
   - No click-to-drill-down
   - No click-to-filter transactions

7. **Empty State**: When a category has no data, display a fallback UI
   - Show category card with "No data available" or similar message
   - Hide/replace chart with placeholder text
   - Keep card visible (don't collapse) so user knows the category exists but is empty

## Non-Goals (Out of Scope)

- Drill-down into sub-accounts (clicking cards does nothing)
- Filtering transactions by clicking categories
- Mobile dashboard support (existing mobile dashboard not yet supported)
- Historical comparison (e.g., "vs last month")
- Custom category groupings beyond the 4 standard types

## Design Considerations

- Follow existing styled-components patterns in `src/ui/`
- Use `FlexContainer` and related components from `SharedStyles.tsx`
- Match existing color scheme and Obsidian CSS variables
- Cards should have clear visual separation (borders/shadows)
- Charts should be small/compact within cards
- **Distinct colors per category**: Each category (Assets, Liabilities, Income, Expenses) should have its own color scheme for visual differentiation

**Suggested layout:**
```
+------------------+------------------+
|     ASSETS       |    LIABILITIES   |
| Total: $X,XXX    | Total: $X,XXX    |
| [donut chart]    | [donut chart]    |
| - Checking: $X   | - Credit: $X     |
| - Savings: $X    | - Loan: $X       |
+------------------+------------------+
|     INCOME       |    EXPENSES      |
| Total: $X,XXX    | Total: $X,XXX    |
| [donut chart]    | [donut chart]    |
| - Salary: $X     | - Food: $X       |
| - Interest: $X   | - Rent: $X       |
+------------------+------------------+
```

## Technical Considerations

- **Balance calculation**: Use `balance-utils.ts` functions, specifically get the latest date's balance from `dailyAccountBalanceMap`
- **Settings persistence**: Add `visibleSnapshotCategories: string[]` to `ISettings` interface
- **Component structure**: Create new `CategorySnapshot.tsx` component
- **Chartist integration**: Reuse patterns from `NetWorthVisualization.tsx` and `AccountVisualization.tsx`
- **Account categorization**: Leverage existing prefixes from settings (`assetAccountsPrefix`, etc.)

## Success Metrics

- Section renders without errors
- Correctly displays balances matching raw ledger data
- Toggle state persists across sessions
- No performance regression on dashboard load

## Open Questions

None - all questions resolved.
