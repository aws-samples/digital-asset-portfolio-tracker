import { withAmbQueryClient } from '../../config/aws/amb-query';

export function callChainQuery(command: any): any {
  return withAmbQueryClient((ambQueryClient) => ambQueryClient.send(command));
}
