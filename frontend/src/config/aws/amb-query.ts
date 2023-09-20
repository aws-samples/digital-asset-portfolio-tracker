import { ManagedBlockchainQueryClient } from '@aws-sdk/client-managedblockchain-query';
import { Credentials } from 'aws-sdk';

let AMB_QUERY_CLIENT: ManagedBlockchainQueryClient;

/**
 * Initializes an instance of the Amazon Managed Blockchain Query SDK client
 */
export function initializeAmbQuery(credentials: Credentials) {
  if (!AMB_QUERY_CLIENT) {
    AMB_QUERY_CLIENT = new ManagedBlockchainQueryClient({
      region: import.meta.env.VITE_AWS_REGION,
      credentials
    });
  }

  return AMB_QUERY_CLIENT;
}

/**
 * Passes the AMB Query Client to a callback function of the SDK has been initialized. Else throws an error
 */
export function withAmbQueryClient<T>(
  ambQueryCallback: (ambQueryClient: ManagedBlockchainQueryClient) => Promise<T>
) {
  if (AMB_QUERY_CLIENT) {
    return ambQueryCallback(AMB_QUERY_CLIENT);
  }

  const error = new Error('AMB Query Client is not initialized');

  console.error(error);

  throw error;
}
