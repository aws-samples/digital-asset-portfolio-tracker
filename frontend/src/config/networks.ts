import { NETWORK_CURRENCIES, NETWORK_NAMES } from '../types/accounts';
import { Network } from '../types/networks';

export const NETWORKS: { [key: string]: Network } = {
  ethereum: {
    name: NETWORK_NAMES.ETHEREUM,
    currency: NETWORK_CURRENCIES.ETHEREUM,
    explorerUrl: 'https://.etherscan.io/',
    explorerUrlTransaction: 'https://etherscan.io/tx'
  },
  bitcoin: {
    name: NETWORK_NAMES.BITCOIN,
    currency: NETWORK_CURRENCIES.BITCOIN,
    explorerUrl: 'https://blockstream.info/mainnet/',
    explorerUrlTransaction: 'https://blockstream.info/tx'
  }
};
