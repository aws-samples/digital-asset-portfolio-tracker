/* eslint-disable unused-imports/no-unused-imports */
import { CognitoIdentityClient, GetOpenIdTokenCommand } from '@aws-sdk/client-cognito-identity';
import { AssumeRoleWithWebIdentityCommand, STSClient } from '@aws-sdk/client-sts';
import { CognitoIdentityCredentials, Credentials } from 'aws-sdk';
import * as CredentialProvider from '@aws-sdk/credential-providers';

const REGION = import.meta.env.VITE_AWS_REGION;

const cognitoIdentityClient = new CognitoIdentityClient({
  region: REGION
});
const stsClient = new STSClient({ region: REGION });

/**
 * This function uses the AWS Amplify & Cognito SDK to get credentials for an unauthenticated identity using the Basic (classic) Auth Flow
 */
export async function getCognitoCredentials() {
  // Get Identity Pool Identity ID

  const getCredentialsFromIdentityPool: CredentialProvider.CognitoIdentityCredentialProvider =
    await CredentialProvider.fromCognitoIdentityPool({
      clientConfig: { region: import.meta.env.VITE_AWS_REGION || '' },
      identityPoolId: import.meta.env.VITE_AWS_COGNITO_IDENTITY_POOL_ID || ''
    });

  const { identityId } = (await getCredentialsFromIdentityPool()) as CognitoIdentityCredentials;

  // Exchange the Identity Pool Identity ID for an OpenID Token

  const getOpenIdToken = new GetOpenIdTokenCommand({ IdentityId: identityId });
  const { Token } = await cognitoIdentityClient.send(getOpenIdToken);

  // Use the OpenID Token to get STS Credentials

  const getStsCredentials = new AssumeRoleWithWebIdentityCommand({
    WebIdentityToken: Token,
    RoleArn: import.meta.env.VITE_AWS_AMB_QUERY_ROLE_ARN,
    RoleSessionName: 'unauthenticated'
  });
  const stsCredentials = await stsClient.send(getStsCredentials);

  return {
    accessKeyId: stsCredentials.Credentials?.AccessKeyId,
    secretAccessKey: stsCredentials.Credentials?.SecretAccessKey,
    sessionToken: stsCredentials.Credentials?.SessionToken,
    expireTime: stsCredentials.Credentials?.Expiration
  } as Credentials;
}
