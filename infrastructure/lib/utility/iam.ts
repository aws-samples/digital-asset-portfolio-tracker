import * as iam from 'aws-cdk-lib/aws-iam';
import * as cognitoIdentityPool from '@aws-cdk/aws-cognito-identitypool-alpha';
import { Construct } from 'constructs';

/**
 * Creates an IAM Policy Statement that gives permission to sts:AssumeRoleWithWebIdentity
 */
export function createIamPolicyStatementStsAssumeRoleWithWebIdentity() {
  return new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
    actions: ['sts:AssumeRoleWithWebIdentity'],
    resources: ['*']
  });
}

/**
 * Creates an IAM Policy Statement that gives permission to AMB Query
 */
export function createIamPolicyStatementAmbQuery() {
  return new iam.PolicyStatement({
    actions: ['managedblockchain-query:*'],
    resources: ['*'],
    effect: iam.Effect.ALLOW
  });
}

/**
 * Creates an IAM Trust Policy for IAM Roles to be assumed by Cognito Identity Pool Unauthenticated Identities
 */
export function createIamRoleTrustPolicyForUnauthenticatedIdentites(
  identityPool: cognitoIdentityPool.IdentityPool
) {
  return new iam.FederatedPrincipal(
    'cognito-identity.amazonaws.com',
    {
      StringEquals: {
        'cognito-identity.amazonaws.com:aud': identityPool.identityPoolId
      },
      'ForAnyValue:StringLike': {
        'cognito-identity.amazonaws.com:amr': 'unauthenticated'
      }
    },
    'sts:AssumeRoleWithWebIdentity'
  );
}

/**
 * Creates an IAM Role with a Policy that grants permission to AMB Query for Cognito Identity Pool Unauthenticated Identities
 */
export function createIamRoleUnauthenticatedIdentitiesAmbQuery(
  scope: Construct,
  identityPool: cognitoIdentityPool.IdentityPool
) {
  // Create an IAM Role with a Trust Policy that allows Unauthenticated Identities of the Identity Pool to assume it

  const trustPolicy = createIamRoleTrustPolicyForUnauthenticatedIdentites(identityPool);

  const role = new iam.Role(scope, 'RoleUnauthenticatedIdentites', {
    assumedBy: trustPolicy
  });

  // Grant the IAM Role permission to AMB Query

  role.addToPolicy(createIamPolicyStatementAmbQuery());

  return role;
}
