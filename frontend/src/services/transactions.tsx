import { ListTransactionsCommandInput } from '@aws-sdk/client-managedblockchain-query';
import {
  getTransaction,
  listTransactionEvents,
  listTransactionsForAddress
} from './amb-query/transactions';
import {
  GetTransactionsOutput,
  ListBitcoinTransactionsCommandInput,
  ListEthereumTransactionsCommandInput,
  TRANSACTION_TYPES,
  Transaction
} from '../types/transactions';
import { NETWORK_IDS } from '../types/accounts';
import { ArrowDownwardTwoTone, ArrowUpwardTwoTone, InfoTwoTone } from '@mui/icons-material';
import { NETWORKS } from '../config/networks';
import { Network } from '../types/networks';
import { formatEther } from 'ethers';

const LIST_TRANSACTIONS_MAX_RESULTS = 10;

export async function getTransactionsForAddress(
  input: ListTransactionsCommandInput
): Promise<GetTransactionsOutput> {
  const userAddress = input.address.toLowerCase();

  // List Transactions

  const { transactions: transactionList, nextToken } = await listTransactionsForAddress({
    maxResults: LIST_TRANSACTIONS_MAX_RESULTS,
    ...input
  });

  // Get each transaction by hash

  const ambQueryTransactions = await Promise.all(
    transactionList.map(({ transactionHash }) =>
      getTransaction({ transactionHash, network: input.network })
    )
  );

  // Get each transaction's events
  // TODO: Get all Transaction Events recursively

  const transactionsEvents = await Promise.all(
    transactionList.map(({ transactionHash }) => {
      return listTransactionEvents({
        transactionHash,
        network: input.network
      });
    })
  );

  // Derive details about each transaction using its events

  const transactions = ambQueryTransactions.map(({ transaction: ambQueryTransaction }, i) => {
    const { network: networkId } = ambQueryTransaction;
    const { events } = transactionsEvents[i];
    let { to, from } = ambQueryTransaction;

    to = to?.toLowerCase();
    from = from?.toLowerCase();

    // Set transaction type and icon background color

    let type = TRANSACTION_TYPES.UNKNOWN;
    let icon = <InfoTwoTone />;
    let iconColor = 'palette.info.main';

    function setTransactionReceive() {
      type = TRANSACTION_TYPES.RECEIVE;
      icon = <ArrowDownwardTwoTone />;
      iconColor = 'success.main';
    }

    function setTransactionSend() {
      type = TRANSACTION_TYPES.SEND;
      icon = <ArrowUpwardTwoTone />;
      iconColor = 'error.main';
    }

    if (to == userAddress) {
      setTransactionReceive();
    } else if (from == userAddress) {
      setTransactionSend();
    }

    let network: Network;

    if (networkId == NETWORK_IDS.BITCOIN) {
      network = NETWORKS.bitcoin;
    } else if (networkId == NETWORK_IDS.ETHEREUM) {
      network = NETWORKS.ethereum;
    }

    // Get transaction events that include user's address

    const userTransactionEvents = events.filter(
      ({ to, from }) => to?.toLowerCase() == userAddress || from?.toLowerCase() == userAddress
    );

    // Use the user's transaction events to:
    //  - Get the total BTC or ETH values for all transfers to/from the user
    //  - Set the transaction to/from relative to the user's address

    const transactionEventValues = userTransactionEvents.flatMap(
      ({
        eventType,
        from: transactionEventFrom,
        to: transactionEventTo,
        value: transactionEventValue,
        network: transactionEventNetwork
      }) => {
        transactionEventFrom = transactionEventFrom?.toLowerCase();
        transactionEventTo = transactionEventTo?.toLowerCase();

        function setTransactionEventReceive() {
          to = transactionEventTo;

          setTransactionReceive();

          return [+transactionEventValue];
        }

        function setTransactionEventSend() {
          from = transactionEventFrom;

          setTransactionSend();

          return [-+transactionEventValue];
        }

        if (transactionEventNetwork == NETWORK_IDS.BITCOIN) {
          if (eventType == 'BITCOIN_VIN') {
            return setTransactionEventSend();
          } else if (eventType == 'BITCOIN_VOUT') {
            return setTransactionEventReceive();
          }
        } else if (transactionEventNetwork == NETWORK_IDS.ETHEREUM) {
          if (eventType.toLowerCase().includes('eth')) {
            if (to == userAddress) {
              return setTransactionEventReceive();
            } else if (from == userAddress) {
              return setTransactionEventSend();
            }
          }
        }

        return [];
      }
    );

    // Add up all transaction event values

    const transactionValue = transactionEventValues.reduce((previous, next) => previous + next, 0);

    const transaction: Transaction = {
      ...ambQueryTransaction,
      networkId,
      network,
      userAddress: input.address,
      type,
      from,
      to,
      value: transactionValue,
      valueFormatted:
        input.network == NETWORK_IDS.ETHEREUM
          ? formatEther(BigInt(transactionValue))
          : transactionValue.toString(),
      transactionEvents: events,
      userTransactionEvents,
      icon,
      iconColor
    };

    return transaction;
  });

  return { transactions, nextToken };
}

export function getBitcoinTransactionsForAddress(input: ListBitcoinTransactionsCommandInput) {
  return getTransactionsForAddress({ network: NETWORK_IDS.BITCOIN, ...input });
}

export function getEthereumTransactionsForAddress(input: ListEthereumTransactionsCommandInput) {
  return getTransactionsForAddress({ network: NETWORK_IDS.ETHEREUM, ...input });
}
