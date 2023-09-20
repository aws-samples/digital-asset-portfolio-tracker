import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import * as cognitoIdentityPool from '@aws-cdk/aws-cognito-identitypool-alpha';
import * as iam from 'aws-cdk-lib/aws-iam';
import { createAmplifyPipelineFromCodeCommitViteJsSpa } from '../utility/amplify';

// Properties from other AWS resources are required for this stack

type FrontEndProps = cdk.StackProps & {
  codecommitRepo: codecommit.Repository;
  identityPool: cognitoIdentityPool.IdentityPool;
  region: string;
  ambQueryRole: iam.Role;
};

/**
 * Deploys the AWS resources needed for the frontend
 */
export class FrontEndStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    { codecommitRepo, identityPool, ambQueryRole, ...props }: FrontEndProps
  ) {
    super(scope, id, props);

    const { region } = props;

    // Amplify App and Pipeline for our ViteJS web app
    // Add environment variables for Cognito Identity Pool ID and AMB Query Role ARN

    const mainBranchName = 'main';

    const { amplifyApp } = createAmplifyPipelineFromCodeCommitViteJsSpa(
      this,
      'PortfolioTrackerFrontEnd',
      codecommitRepo,
      mainBranchName,
      {
        environmentVariables: {
          VITE_APP_NAME: 'Portfolio Tracker',
          VITE_AWS_REGION: region,
          VITE_AWS_COGNITO_IDENTITY_POOL_ID: identityPool.identityPoolId,
          VITE_AWS_AMB_QUERY_ROLE_ARN: ambQueryRole.roleArn
        }
      }
    );

    // Get the URL that our app will be deployed to

    const amplifyAppUrl = `https://${mainBranchName}.${amplifyApp.defaultDomain}`;

    /* CDK Outputs */

    // Stack region

    new cdk.CfnOutput(this, `${this.stackName}Region`, {
      value: this.region
    });

    // Amplify app URL

    new cdk.CfnOutput(this, `${this.stackName}AmplifyAppUrl`, {
      value: amplifyAppUrl
    });
  }
}
