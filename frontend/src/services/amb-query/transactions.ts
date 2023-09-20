import {
  GetTransactionCommand,
  GetTransactionCommandInput,
  GetTransactionCommandOutput,
  ListTransactionEventsCommand,
  ListTransactionEventsCommandInput,
  ListTransactionEventsCommandOutput,
  ListTransactionsCommand,
  ListTransactionsCommandInput,
  ListTransactionsCommandOutput
} from '@aws-sdk/client-managedblockchain-query';
import { callChainQuery } from '.';

export function listTransactionsForAddress(
  input: ListTransactionsCommandInput
): Promise<ListTransactionsCommandOutput> {
  const command = new ListTransactionsCommand({
    ...input,
    sort: { sortOrder: 'DESCENDING', ...input.sort }
  });

  return callChainQuery(command);
}

export function listTransactionEvents(
  input: ListTransactionEventsCommandInput
): Promise<ListTransactionEventsCommandOutput> {
  const command = new ListTransactionEventsCommand({ maxResults: 250, ...input });

  return callChainQuery(command);
}

export function getTransaction(
  input: GetTransactionCommandInput
): Promise<GetTransactionCommandOutput> {
  const command = new GetTransactionCommand(input);

  return callChainQuery(command);
}
