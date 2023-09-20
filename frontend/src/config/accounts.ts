import { AccountMap, LocalStorageAccount } from '../types/accounts';

/**
 * Reads accounts from local storage
 */
export function getAccountsFromLocalStorage() {
  const localStorageAccounts = localStorage.getItem('accounts');
  let localStorageAccountsJson: LocalStorageAccount;

  if (localStorageAccounts) {
    try {
      localStorageAccountsJson = JSON.parse(localStorageAccounts);
    } catch (error) {
      console.error(error);
    }
  }

  return localStorageAccountsJson;
}

/**
 * Map() used to store user's accounts
 * Pre-populated with accounts from local storage
 */
export const ACCOUNT_MAP: AccountMap = new Map(Object.entries(getAccountsFromLocalStorage() || {}));

/**
 * Clears accounts from local storage and account map
 */
export function clearAccountsCache() {
  localStorage.removeItem('accounts');
  ACCOUNT_MAP.clear();
}
