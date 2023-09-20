export type Account = {
  name: string;
  address: string;
  network: string;
  isSelected: boolean;
};

export type LocalStorageAccount = {
  [address: string]: Account;
};

export type AccountMap = Map<string, Account>;

export enum NETWORK_IDS {
  ETHEREUM = 'ETHEREUM_MAINNET',
  BITCOIN = 'BITCOIN_MAINNET'
}

export enum NETWORK_NAMES {
  ETHEREUM = 'Ethereum',
  BITCOIN = 'Bitcoin'
}

export enum NETWORK_CURRENCIES {
  ETHEREUM = 'Ether',
  BITCOIN = 'Bitcoin'
}

export type AccountAutocompleteOption = {
  label: string;
  value: string;
  selected: boolean;
};
