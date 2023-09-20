import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cognitoIdentityPool from '@aws-cdk/aws-cognito-identitypool-alpha';
import * as iam from 'aws-cdk-lib/aws-iam';
import { createIdentityPoolForUnauthenticatedIdentitiesBasicAuthFlow } from '../utility/cognito';
import { createIamRoleUnauthenticatedIdentitiesAmbQuery } from '../utility/iam';

/**
 * Creates a Cognito Identity Pool configured with the Basic (classic) Auth Flow to allow unauthenticated identities to access AMB Query
 * https://docs.aws.amazon.com/cognito/latest/developerguide/authentication-flow.html
 */
export class AuthenticationStack extends cdk.Stack {
  identityPool: cognitoIdentityPool.IdentityPool;
  ambQueryRole: iam.Role;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /* Cognito Identity Pool configured with Unauthenticated Identities and the Basic Auth Flow */

    this.identityPool = createIdentityPoolForUnauthenticatedIdentitiesBasicAuthFlow({
      scope: this,
      identityPoolName: 'PortfolioTrackerIdentityPool'
    });

    // Create IAM Role for Identity Pool Identities to assume.
    // This IAM Role will grant access to AMB Query and will be used by the front end to generate AWS credentials for users.

    this.ambQueryRole = createIamRoleUnauthenticatedIdentitiesAmbQuery(this, this.identityPool);

    /* CDK Outputs */

    // Stack region

    new cdk.CfnOutput(this, `${this.stackName}Region`, {
      value: this.region
    });
  }
}
