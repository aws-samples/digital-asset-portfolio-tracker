import * as cdk from 'aws-cdk-lib';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import { Construct } from 'constructs';
import { createCodeCommitRepo } from '../utility/codecommit';

/**
 * Deploys a CodeCommit repo that will host this app's code
 */
export class SourceCodeStack extends cdk.Stack {
  codecommitRepo: codecommit.Repository;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Initialize an empty repo that will store this CDK code and our React web app code

    this.codecommitRepo = createCodeCommitRepo(this, 'PortfolioTrackerRepo');

    /* CDK Outputs */

    // Stack region

    new cdk.CfnOutput(this, `${this.stackName}Region`, {
      value: this.region
    });

    // URLs to clone the repo

    new cdk.CfnOutput(this, `${this.stackName}CodeCommitRepositoryCloneUrlHttp`, {
      value: this.codecommitRepo.repositoryCloneUrlHttp
    });

    new cdk.CfnOutput(this, `${this.stackName}CodeCommitRepositoryCloneUrlGrc`, {
      value: this.codecommitRepo.repositoryCloneUrlGrc
    });
  }
}
