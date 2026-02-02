# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev          # watch mode development
yarn build        # production build (compiles grammar + rollup)
yarn test         # run all tests
yarn test-watch   # run tests in watch mode
yarn eslint       # fix linting issues
yarn prettier     # format code
```

Grammar compilation happens automatically during build/test. Manual: `yarn compile-parser`

## Architecture

Obsidian plugin for plain text accounting using Ledger CLI format.

### Data Flow

```
Ledger File → Parser (Nearley) → TransactionCache → React UI
```

1. **Parser** (`src/parser.ts` + `grammar/ledger.ne`): Nearley grammar parses ledger files into transactions, aliases, comments. Uses moo tokenizer with multi-state lexing.

2. **TransactionCache**: Central data store containing transactions, categorized accounts, payees, aliases, parsing errors. Components subscribe via `registerTxCacheSubscription()`.

3. **React UI** (`src/ui/`): Dashboard, transaction editor (Formik), transaction list (react-table), charts (Chartist).

### Key Files

| File | Purpose |
|------|---------|
| `src/main.ts` | Plugin entry, commands, settings, file watcher |
| `src/parser.ts` | Ledger parsing engine |
| `src/file-interface.ts` | File I/O, transaction CRUD |
| `src/balance-utils.ts` | Balance/net worth calculations |
| `src/ledgerview.ts` | Obsidian view ↔ React bridge |
| `grammar/ledger.ne` | Nearley grammar for ledger format |

### Patterns

- **Subscriptions**: Views subscribe to cache updates for reactive UI
- **Result types**: `neverthrow` for functional error handling in parser
- **Account hierarchy**: Colon-separated paths (e.g., `Expenses:Food:Groceries`)
