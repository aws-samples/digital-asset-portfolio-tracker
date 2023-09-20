import { createContext, useReducer } from 'react';
import { ACCOUNT_MAP, clearAccountsCache } from '../config/accounts';
import { Account, AccountMap, LocalStorageAccount } from '../types/accounts';

/* Store for user-entered accounts */

// Context types

type AccountContextAction = {
  method: 'addAccount' | 'updateAccount' | 'removeAccount' | 'clearAccounts';
  payload?: {
    account: Account;
  };
};

type AccountContextProps = {
  accounts: AccountMap;
  setAccounts: React.Dispatch<AccountContextAction>;
};

/**
 * Account Context reducer to update the ACCOUNT_MAP
 */
function accountContextReducer(accounts: AccountMap, action: AccountContextAction) {
  const account = action.payload?.account;
  const address = account?.address;

  switch (action.method) {
    case 'addAccount':
    case 'updateAccount':
      accounts.set(address, account);
      break;
    case 'removeAccount':
      accounts.delete(address);
      break;
    case 'clearAccounts':
      accounts.clear();
      clearAccountsCache();
      break;
  }

  localStorage.setItem(
    'accounts',
    JSON.stringify(
      Array.from(accounts).reduce((accountsOject, [address, account]) => {
        accountsOject[address] = account;

        return accountsOject;
      }, {} as LocalStorageAccount)
    )
  );

  return new Map(accounts);
}

// Create context

export const AccountContext = createContext<AccountContextProps>({
  accounts: ACCOUNT_MAP,
  setAccounts: () => null
});

export const AccountContextProvider: React.FC<React.HTMLProps<HTMLElement>> = ({
  children
}: React.HTMLProps<HTMLElement>) => {
  const [accounts, setAccounts] = useReducer(accountContextReducer, ACCOUNT_MAP);

  return (
    <AccountContext.Provider value={{ accounts, setAccounts }}>{children}</AccountContext.Provider>
  );
};
