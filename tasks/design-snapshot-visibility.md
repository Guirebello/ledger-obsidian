# Design Analysis: CategorySnapshot Visibility Strategy

## Question

Should CategorySnapshot cards always be visible, or hide when user filters by account?

## Current behavior

Cards only show when `selectedAccounts.length === 0`. When user clicks any account in sidebar, cards disappear.

## Options to consider

### Option A: Always visible (above everything)
- Cards always show regardless of filter
- Pros: Consistent overview, always see totals
- Cons: Takes vertical space, may feel redundant when viewing specific account

### Option B: Current behavior (hide on filter)
- Cards disappear when any account selected
- Pros: More space for filtered view, focused UI
- Cons: Loses overview context, confusing transition

### Option C: Collapsed state when filtered
- Cards collapse to a single summary line when filtered
- Click to expand back to full view
- Pros: Preserves context without taking space
- Cons: More complexity

### Option D: Show filtered category only
- When user selects "Expenses:Food", only show Expenses card
- Other cards hide or collapse
- Pros: Contextually relevant
- Cons: Loses overall picture

### Option E: Sidebar mini-summary
- Move totals to sidebar instead of main area
- Small inline numbers next to category headers
- Pros: Always visible, no space competition
- Cons: Less visual impact, no charts

## Questions to answer

1. What's the primary use case? Quick glance vs detailed analysis?
2. Do users want totals visible while exploring specific accounts?
3. Is vertical space a concern on typical screens?
4. Should charts be visible always or just in overview mode?

## Recommendation

Consider Option C (collapsed state) or Option E (sidebar mini-summary) as middle ground. But gather user feedback first on what information they want persistent.
