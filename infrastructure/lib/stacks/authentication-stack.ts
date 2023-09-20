import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cognitoIdentityPool from '@aws-cdk/aws-cognito-identitypool-alpha';
import * as iam from 'aws-cdk-lib/aws-iam';
import { createIdentityPoolForUnauthenticatedIdentitiesBasicAuthFlow } from '../utility/cognito';
import { createIamRoleUnauthenticatedIdentitiesAmbQuery } from '../utility/iam';
import { NagSuppressions } from 'cdk-nag';

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

    /* Nag Suppressions */

    // Cognito Identity Pool with Unauthenticated Identities

    NagSuppressions.addStackSuppressions(this, [
      {
        id: 'AwsSolutions-COG7',
        reason:
          'The Cognito Identity Pool should allow for unauthenticated identities because our application requires access to Amazon Managed Blockchain Query but does not require user login/signup. The front end web application follows the Cognito Identity Pool Basic (Classic) authflow to grant unauthenticated access to AMB Query via an IAM Role.'
      }
    ]);

    // Cognito Identity Pool default Unauthenticated Role

    NagSuppressions.addStackSuppressions(this, [
      {
        id: 'AwsSolutions-IAM5',
        appliesTo: ['Resource::*'],
        reason: 'This is a default added by the Cogntio Identity Pool Unauthenticated Role'
      }
    ]);

    // IAM Role that grants permission to AMB Query for Unauthenticated Identity Pool Identities to assume

    NagSuppressions.addStackSuppressions(this, [
      {
        id: 'AwsSolutions-IAM5',
        appliesTo: ['Action::managedblockchain-query:*'],
        reason:
          'The purpose of this project is to showcase all AMB Query features. Also, AMB Query is a read-only service that provides information already available on public networks.'
      }
    ]);

    /* CDK Outputs */

    // Stack region

    new cdk.CfnOutput(this, `${this.stackName}Region`, {
      value: this.region
    });
  }
}
