import { GIVING } from './site';

export interface GiveLocalAlternative {
  label: string;
  bank: string;
  accountNumber: string;
  accountName: string;
}

export interface GiveCountry {
  code: string;
  name: string;
  flag: string;
  currency: string;
  quickAmounts: number[];
  /**
   * A country-specific alternative to card payment (e.g. a bank transfer or mobile-money
   * number). Only Nigeria has one today. Leave this unset for a country and the Give page
   * automatically shows a "coming soon" placeholder instead — fill it in later and that
   * country's page picks it up with no other code changes.
   */
  localAlternative?: GiveLocalAlternative;
}

/** Countries with a direct Flutterwave-supported local payment corner. */
export const GIVE_COUNTRIES: GiveCountry[] = [
  {
    code: 'NG',
    name: 'Nigeria',
    flag: '🇳🇬',
    currency: 'NGN',
    quickAmounts: [1000, 5000, 10000, 20000],
    localAlternative: {
      label: 'Bank Transfer',
      bank: GIVING.bank,
      accountNumber: GIVING.accountNumber,
      accountName: GIVING.accountName,
    },
  },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', currency: 'GHS', quickAmounts: [20, 50, 100, 200] },
  { code: 'CM', name: 'Cameroon', flag: '🇨🇲', currency: 'XAF', quickAmounts: [2000, 5000, 10000, 20000] },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', currency: 'KES', quickAmounts: [500, 1000, 2500, 5000] },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', currency: 'ZAR', quickAmounts: [100, 250, 500, 1000] },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬', currency: 'UGX', quickAmounts: [20000, 50000, 100000, 200000] },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿', currency: 'TZS', quickAmounts: [10000, 25000, 50000, 100000] },
  { code: 'ZM', name: 'Zambia', flag: '🇿🇲', currency: 'ZMW', quickAmounts: [100, 250, 500, 1000] },
];

/** Non-country currency options, shown alongside the country cards. */
export const GIVE_INTL_OPTIONS: GiveCountry[] = [
  { code: 'INTL_USD', name: 'International', flag: '🌍', currency: 'USD', quickAmounts: [10, 25, 50, 100] },
  { code: 'INTL_EUR', name: 'Europe', flag: '🇪🇺', currency: 'EUR', quickAmounts: [10, 25, 50, 100] },
];

export type GiveFrequency = 'one_time' | 'weekly' | 'monthly';

export const GIVE_FREQUENCIES: { value: GiveFrequency; label: string }[] = [
  { value: 'one_time', label: 'One-time' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

/**
 * Static crypto wallet addresses shown when a giver's country isn't listed above.
 * REPLACE THESE PLACEHOLDERS with your real wallet addresses before going live —
 * sending crypto to the placeholder values below would send it nowhere recoverable.
 */
export const CRYPTO_WALLETS = {
  usdt: {
    label: 'USDT (TRC20)',
    address: 'REPLACE_WITH_YOUR_USDT_TRC20_ADDRESS',
  },
  btc: {
    label: 'BTC',
    address: 'REPLACE_WITH_YOUR_BTC_ADDRESS',
  },
};
