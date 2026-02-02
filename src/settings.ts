const defaultSettings: ISettings = {
  tutorialIndex: 0,

  currencySymbol: '$',
  ledgerFile: 'transactions.ledger',

  assetAccountsPrefix: 'Assets',
  expenseAccountsPrefix: 'Expenses',
  incomeAccountsPrefix: 'Income',
  liabilityAccountsPrefix: 'Liabilities',

  visibleSnapshotCategories: ['Assets', 'Liabilities', 'Income', 'Expenses'],
};

export interface ISettings {
  tutorialIndex: number;

  currencySymbol: string;
  ledgerFile: string;

  assetAccountsPrefix: string;
  expenseAccountsPrefix: string;
  incomeAccountsPrefix: string;
  liabilityAccountsPrefix: string;

  visibleSnapshotCategories: string[];
}

export const settingsWithDefaults = (
  settings: Partial<ISettings>,
): ISettings => ({
  ...defaultSettings,
  ...settings,
});
