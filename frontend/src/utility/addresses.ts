import { NETWORK_IDS } from '../types/accounts';
import { getNetworkIdFromAddress } from './networks';
import { ethereumWalletAddressRegExp } from './regexp';
import * as BitcoinAddressValidator from 'bitcoin-address-validation';

export function postProcessAddressInput(address: string) {
  // Always trim input

  address = address.trim();

  // Always make Ethereum addresses lowercase as they are case-insensitive and used as keys in the app

  if (getNetworkIdFromAddress(address) === NETWORK_IDS.ETHEREUM) {
    address = address.toLowerCase();
  }

  return address;
}

export function validateEthereumAddress(address: string) {
  return ethereumWalletAddressRegExp.test(address);
}

export function validateBitcoinAddress(address: string) {
  return BitcoinAddressValidator.validate(address);
}

export function isAddressValid(address: string) {
  return validateBitcoinAddress(address) || validateEthereumAddress(address);
}
