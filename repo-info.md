# Ledger-Obsidian Plugin Overview

Obsidian plugin for plain-text accounting using ledger format.

## Tech Stack

| Layer | Tech |
|-------|------|
| **UI Framework** | React 17 + styled-components |
| **Charts** | Chartist (via react-chartist) |
| **Tables** | react-table 7 |
| **Forms** | Formik |
| **Parser** | Nearley + Moo lexer |
| **Dates** | moment.js |
| **Utilities** | lodash, fuse.js (fuzzy search), neverthrow (Result type) |
| **Bundler** | Rollup |

## Why React?

The UI **does use React**. Obsidian plugins commonly use React for complex UIs. The plugin renders React components inside Obsidian's view system via `ledgerview.ts`.

## File Structure

```
src/
├── main.ts              # Plugin entry, Obsidian hooks
├── ledgerview.ts        # Custom view → renders LedgerDashboard
├── modals.ts            # AddExpenseModal (wraps EditTransaction)
├── settings.ts          # ISettings interface + defaults
├── settings-tab.ts      # Settings UI
├── file-interface.ts    # Read/write ledger files, LedgerModifier
├── parser.ts            # Parse ledger → TransactionCache
├── transaction-utils.ts # Format transactions, calc totals
├── balance-utils.ts     # Balance calcs, chart data, net worth
├── date-utils.ts        # Date bucketing, intervals
└── ui/
    ├── LedgerDashboard.tsx      # Main dashboard, tabs, layout
    ├── EditTransaction.tsx      # Transaction form (Formik)
    ├── TransactionList.tsx      # Sortable table (react-table)
    ├── AccountsList.tsx         # Accounts tree + balances
    ├── AccountVisualization.tsx # Line/bar charts (Chartist)
    ├── NetWorthVisualization.tsx# Net worth line chart
    ├── DateRangeSelector.tsx    # Date range picker
    ├── CurrencyInput.tsx        # Currency input
    ├── TextSuggest.tsx          # Autocomplete (fuse.js)
    ├── ParseErrors.tsx          # Error display
    └── SharedStyles.tsx         # Shared styled-components

grammar/
├── ledger.ne            # Nearley grammar definition
└── ledger.ts            # Generated parser
```

## Data Flow

```
ledger.md file
    ↓
parser.ts (uses grammar/ledger.ts)
    ↓
TransactionCache {
  transactions[]
  accounts[]
  payees[]
  aliases
  parsingErrors[]
  expenseAccounts[], assetAccounts[], etc.
}
    ↓
LedgerPlugin (main.ts) manages cache + subscriptions
    ↓
UI components receive cache → render
```

## Key Relationships

### main.ts (LedgerPlugin)
- Entry point, registers everything with Obsidian
- Manages `TransactionCache` lifecycle
- Watches ledger file changes → updates cache → notifies subscribers
- Creates views, modals, commands

### parser.ts → TransactionCache
- Parses ledger file format using Nearley grammar
- Resolves aliases, categorizes accounts
- Output consumed by all UI components

### ledgerview.ts
- Custom Obsidian view type (`LedgerViewType`)
- Subscribes to cache updates
- Renders `<LedgerDashboard />` via ReactDOM

### file-interface.ts → LedgerModifier
- Abstracts file I/O
- `updateTransaction()`, `deleteTransaction()`, `appendLedger()`
- Used by modals and forms to persist changes

### UI Components
- **LedgerDashboard**: orchestrates all sub-components, handles tabs
- **EditTransaction**: Formik form, calls `LedgerModifier` on submit
- **AccountVisualization**: uses `balance-utils` → feeds Chartist
- **TransactionList**: uses `react-table` for sorting/filtering

## Charts (Chartist)

Used in:
- `AccountVisualization.tsx`: line chart (balance over time), bar chart (delta/P&L)
- `NetWorthVisualization.tsx`: line chart (assets - liabilities)

Data prep in `balance-utils.ts`:
- `getAccountBalances()` → time-series balance data
- Bucketed by date intervals (day/week/month/year) via `date-utils.ts`

## Styling

All components use `styled-components`. Respects Obsidian CSS vars:
```ts
const Container = styled.div`
  color: var(--text-normal);
  background: var(--background-primary);
`;
```

## Testing

Jest tests in `tests/`. Run: `npm test`

---

## Development Cycle

### How `yarn dev` works

```bash
yarn dev  →  rollup --config rollup.config.js -w
```

**What happens:**
1. Rollup watches all source files (`-w` flag)
2. On change: bundles `src/main.ts` → `main.js` (root dir)
3. Output format: CommonJS (Obsidian requirement)
4. Externals: `obsidian`, `fs`, `os`, `path` (provided by Obsidian runtime)

### Build pipeline

```
src/main.ts
    ↓
typescript()     → Type-check + transpile TS
    ↓
resolve()        → Resolve node_modules imports
    ↓
replace()        → Replace process.env.NODE_ENV
    ↓
babel()          → Transpile JSX (React) + modern JS
    ↓
commonjs()       → Convert ES modules to CommonJS
    ↓
main.js          → Single bundled file
```

### Obsidian plugin structure

Obsidian looks for:
```
plugin-folder/
├── main.js       # Bundled plugin code (output of rollup)
├── manifest.json # Plugin metadata (id, name, version, minAppVersion)
└── styles.css    # Optional styles (not used here, uses styled-components)
```

### Dev workflow

1. **Setup vault**: Symlink/copy this repo to `<vault>/.obsidian/plugins/ledger-obsidian/`
2. **Run**: `yarn dev` (watches and rebuilds)
3. **Reload**: In Obsidian: `Ctrl+P` → "Reload app without saving" (or disable/enable plugin)
4. **See changes**: Plugin reloads with new `main.js`

### Hot reload limitation

No true hot reload. Each code change requires:
- `yarn dev` auto-rebuilds `main.js`
- Manually reload plugin in Obsidian (toggle off/on or reload app)

### Scripts

| Command | Purpose |
|---------|---------|
| `yarn dev` | Watch mode, rebuild on change |
| `yarn build` | Production build (compiles parser + builds) |
| `yarn compile-parser` | Regenerate `grammar/ledger.ts` from `grammar/ledger.ne` |
| `yarn test` | Run Jest tests |
| `yarn eslint` | Lint + fix |
| `yarn prettier` | Format code |

### Parser workflow

If you modify `grammar/ledger.ne`:
```bash
yarn compile-parser  # Regenerates grammar/ledger.ts
yarn dev             # Rebuild plugin
```

The `.ne` file uses Nearley grammar syntax. The generated `ledger.ts` is the actual parser used at runtime.
