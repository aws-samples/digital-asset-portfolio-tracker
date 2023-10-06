import { NETWORK_IDS, NETWORK_NAMES } from '../types/accounts';
import { validateBitcoinAddress, validateEthereumAddress } from './addresses';

export function getNetworkIcon(network: string) {
  if (network.includes('ethereum')) {
    return 'https://assets.coingecko.com/coins/images/279/small/ethereum.png';
  } else if (network.includes('bitcoin')) {
    return 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png';
  }

  console.warn('Could not find network icon for:', network);

  return '';
}

export function getNetworkFromAddress(address: string) {
  if (validateBitcoinAddress(address)) {
    return NETWORK_NAMES.BITCOIN;
  } else if (validateEthereumAddress(address)) {
    return NETWORK_NAMES.ETHEREUM;
  }

  throw new Error(`Could not find network for address: ${address}`);
}

export function getNetworkIdFromAddress(address: string) {
  if (validateBitcoinAddress(address)) {
    return NETWORK_IDS.BITCOIN;
  } else if (validateEthereumAddress(address)) {
    return NETWORK_IDS.ETHEREUM;
  }

  throw new Error(`Could not find network for address: ${address}`);
}
