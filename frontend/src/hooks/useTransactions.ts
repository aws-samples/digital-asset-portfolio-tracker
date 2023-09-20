import { useContext } from 'react';
import { TransactionContext } from '../context/TransactionContext';

export function useTransactions() {
  return useContext(TransactionContext);
}
