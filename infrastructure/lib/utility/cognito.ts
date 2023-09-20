import { Construct } from 'constructs';
import * as cognitoIdentityPool from '@aws-cdk/aws-cognito-identitypool-alpha';
import { createIamPolicyStatementStsAssumeRoleWithWebIdentity } from './iam';

type IdentityPoolProps = {
  scope: Construct;
  identityPoolName: string;
  identityPoolOptions?: cognitoIdentityPool.IdentityPoolProps;
};

/**
 * Creates a Cognito Identity Pool
 */
export function createIdentityPool({
  scope,
  identityPoolName,
  identityPoolOptions
}: IdentityPoolProps) {
  return new cognitoIdentityPool.IdentityPool(scope, identityPoolName, identityPoolOptions);
}

/**
 * Creates a Cognito Identity Pool to be used for unauthenticated access with the Basic (Classic) Auth Flow
 * https://docs.aws.amazon.com/cognito/latest/developerguide/authentication-flow.html
 */
export function createIdentityPoolForUnauthenticatedIdentitiesBasicAuthFlow({
  scope,
  identityPoolName,
  identityPoolOptions
}: IdentityPoolProps) {
  const identityPool = createIdentityPool({
    scope,
    identityPoolName,
    identityPoolOptions: {
      ...identityPoolOptions,
      allowClassicFlow: true,
      allowUnauthenticatedIdentities: true
    }
  });

  // Give the Identity Pool Unauthenticated IAM Role permission to sts:AssumeRoleWithWebIdentity.
  // This is required for the Basic Auth Flow, the identities created by this Identity Pool will make an
  // AssumeRoleWithWebIdentity request to receive credentials for an IAM Role that gives them access to AMB Query.

  const iamPolicyStatementStsAssumeRoleWithWebIdentity =
    createIamPolicyStatementStsAssumeRoleWithWebIdentity();

  identityPool.unauthenticatedRole.addToPrincipalPolicy(
    iamPolicyStatementStsAssumeRoleWithWebIdentity
  );

  return identityPool;
}
