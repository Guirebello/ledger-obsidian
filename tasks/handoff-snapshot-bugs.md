# Handoff: Category Snapshot Bugs

## Context

Category Snapshot Dashboard feature was implemented. User testing revealed 2 issues.

## Bug 1: Tutorial modal opens on UI clicks

**Problem:** Every click on UI elements triggers the tutorial modal to open.

**Likely cause:** Tutorial state/index not properly initialized or check condition wrong.

**Files to investigate:**
- `src/ui/LedgerDashboard.tsx` - Tutorial component and `tutorialIndex` logic
- `src/main.ts` - `tutorialIndex` in settings, initialization

**Expected:** Tutorial should only show on first use or when explicitly reset via command.

## Bug 2: No way to unselect sidebar categories

**Problem:** When user clicks a category (e.g. Expenses) in sidebar, the new CategorySnapshot cards disappear (as designed - they only show when no accounts selected). But there's no way to deselect/clear the selection to bring cards back.

**Files to modify:**
- `src/ui/AccountsList.tsx` - Add "Clear selection" or "Unselect all" button
- Uses `selectedAccounts` state and `setSelectedAccounts` prop

**Solution:** Add a button/link at top of AccountsList that calls `setSelectedAccounts([])` when clicked. Only show when `selectedAccounts.length > 0`.

## Relevant files

- `src/ui/LedgerDashboard.tsx:114-115` - selectedAccounts state
- `src/ui/AccountsList.tsx` - sidebar component
- `src/ui/LedgerDashboard.tsx:154` - condition that hides CategorySnapshot
