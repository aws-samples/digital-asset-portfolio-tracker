import {
  Transaction as AmbQueryTransaction,
  TransactionEvent,
  ListTransactionsCommandInput,
  ListTransactionsCommandOutput
} from '@aws-sdk/client-managedblockchain-query';
import { ReactNode } from 'react';
import { Network } from './networks';

export enum TRANSACTION_TYPES {
  SEND = 'Send',
  RECEIVE = 'Receive',
  UNKNOWN = 'Unknown'
}

export type Transaction = Omit<AmbQueryTransaction, 'network'> & {
  networkId: AmbQueryTransaction['network'];
  network: Network;
  userAddress: string;
  type: string;
  value: number;
  valueFormatted: string;
  transactionEvents: TransactionEvent[];
  userTransactionEvents: TransactionEvent[];
  icon: ReactNode;
  iconColor: string;
};

export type TransactionMap = Map<string, Transaction>;

export type TransactionNextTokenMap = Map<string, ListTransactionsCommandInput['nextToken']>;

export type ListBitcoinTransactionsCommandInput = Omit<ListTransactionsCommandInput, 'network'> & {
  network?: ListTransactionsCommandInput['network'];
};

export type ListEthereumTransactionsCommandInput = ListBitcoinTransactionsCommandInput;

export type GetTransactionsOutput = {
  transactions: Transaction[];
  nextToken?: ListTransactionsCommandOutput['nextToken'];
};
