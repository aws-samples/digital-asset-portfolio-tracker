import { NETWORK_IDS } from '../types/accounts';
import { useAccountsSelected } from './useAccountsSelected';

export function useAccountsSelectedBitcoin() {
  const selectedAccounts = useAccountsSelected();

  return selectedAccounts.filter(({ network }) => network == NETWORK_IDS.BITCOIN);
}
