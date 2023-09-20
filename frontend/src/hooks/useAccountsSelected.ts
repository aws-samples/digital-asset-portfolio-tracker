import { useAccounts } from './useAccounts';

export function useAccountsSelected() {
  const { selectedAccounts } = useAccounts();

  return selectedAccounts;
}
