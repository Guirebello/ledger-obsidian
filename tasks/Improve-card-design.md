# PRD: Time-Filtered Category Snapshots

## Problem

User wants to see:
- **Current balance** for Assets (how much I have NOW)
- **Period-filtered totals** for Expenses/Income/Liabilities (how much this month/week)

Currently CategorySnapshot shows all-time cumulative totals for all categories, ignoring the date range filter.

## User Story

> As a user viewing my dashboard with "Monthly" filter set to January 2025,
> I want to see:
> - Assets card: my current total balance (e.g., $50,000)
> - Expenses card: what I spent in January only (e.g., $2,500)
> - Income card: what I earned in January only (e.g., $4,000)
> - Liabilities card: debt changes in January (e.g., +$500 new debt)

## Proposed Behavior

| Category | Time Filter Behavior |
|----------|---------------------|
| **Assets** | Always current/cumulative (ignores date filter) |
| **Expenses** | Period-filtered (sum in date range) |
| **Income** | Period-filtered (sum in date range) |
| **Liabilities** | Period-filtered (sum in date range) |

**Charts**: Period-filtered cards show pie charts with period data (consistent with totals).

## Implementation Approach

### Data Flow Change

```
Current:
  dailyAccountBalanceMap → CategorySnapshot → shows latest cumulative

Proposed:
  For Assets: dailyAccountBalanceMap[today] → cumulative balance
  For Expenses/Income: filter transactions by date range → sum amounts
```

### Key Changes

1. **CategorySnapshot.tsx**
   - Accept `startDate`, `endDate` props from LedgerDashboard
   - Calculate totals differently per category type:
     - Assets: use existing cumulative balance logic
     - Expenses/Income: sum transaction amounts in date range

2. **New utility function** (balance-utils.ts)
   - `getPeriodDataByCategory(txCache, category, startDate, endDate)`
   - Filters transactions by date and category prefix
   - Returns { total, accountBreakdown } for both totals and pie chart

3. **CategoryCard.tsx**
   - Show subtitle indicating data type: "Current" vs "Jan 1 - Jan 31"
   - Receive pre-computed data (either cumulative or period-filtered)

### UI Indication

Cards should indicate what they're showing:
```
┌─────────────────────┐
│ Assets              │
│ Current Balance     │  ← subtitle
│ $50,000            │
└─────────────────────┘

┌─────────────────────┐
│ Expenses            │
│ Jan 1 - Jan 31      │  ← subtitle showing date range
│ $2,500             │
└─────────────────────┘
```

## Files to Modify

- `src/ui/LedgerDashboard.tsx` - pass date props to CategorySnapshot
- `src/ui/CategorySnapshot.tsx` - category-specific calculation logic
- `src/ui/CategoryCard.tsx` - add subtitle prop for date context
- `src/balance-utils.ts` - new period sum utility

## Verification

1. Set date filter to "Monthly" with specific month
2. Assets card shows current total (same as before filter)
3. Expenses card shows only that month's expenses
4. Change to different month → Expenses updates, Assets stays same

---

## Decisions Made

- **Empty state**: Show $0 card (consistent layout)
- **Account breakdown**: Show accounts with activity in period only (implied by period filtering)

---

## Agent Handoff

### Summary
Make CategorySnapshot cards respect the existing date range filter, but only for flow categories (Expenses/Income/Liabilities). Assets stays cumulative.

### Behavior by Category
- **Assets**: Current cumulative balance + all-time chart (ignore date filter)
- **Expenses/Income/Liabilities**: Sum transactions in `startDate`-`endDate` range, chart shows period breakdown

### Implementation Steps
1. Add `startDate`, `endDate` props to `CategorySnapshot` (from `LedgerDashboard`)
2. Create `getPeriodDataByCategory()` in `balance-utils.ts` to filter transactions by date + category
3. In `CategorySnapshot`, branch logic: Assets uses existing cumulative, others use period function
4. Add subtitle to `CategoryCard` showing "Current" or date range
5. Pass filtered account data to charts

### Key Files
- `src/ui/LedgerDashboard.tsx:154-176` - where CategorySnapshot is rendered
- `src/ui/CategorySnapshot.tsx` - main changes here
- `src/ui/CategoryCard.tsx` - add subtitle prop
- `src/balance-utils.ts` - new utility function

### Test
1. `yarn dev`
2. Open dashboard, set filter to specific month
3. Assets = same regardless of filter
4. Expenses = changes when month changes
