import { useContext } from 'react';
import { AccountContext } from '../context/AccountContext';

export function useAccounts() {
  const { accounts: accountMap } = useContext(AccountContext);
  const accounts = [...accountMap.values()];

  return {
    accountMap,
    accounts,
    selectedAccounts: accounts.filter(({ isSelected }) => isSelected)
  };
}
