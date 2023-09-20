import { NETWORK_CURRENCIES, NETWORK_NAMES } from './accounts';

export type Network = {
  name: NETWORK_NAMES;
  currency: NETWORK_CURRENCIES;
  explorerUrl: string;
  explorerUrlTransaction: string;
};
