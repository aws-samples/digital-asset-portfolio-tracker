#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AwsSolutionsChecks } from 'cdk-nag';
import { SourceCodeStack } from '../lib/stacks/source-code-stack';
import { AuthenticationStack } from '../lib/stacks/authentication-stack';
import { FrontEndStack } from '../lib/stacks/front-end-stack';

// Initialize our CDK App https://aws.amazon.com/cdk/

const app = new cdk.App();

// Configure cdk-nag for security and compliance of our CDK code

cdk.Aspects.of(app).add(new AwsSolutionsChecks({ verbose: true }));

// Set the environment for all of our CDK Stacks
// Set to a region supported by AMB Query: https://docs.aws.amazon.com/managed-blockchain/latest/ambq-dg/key-concepts.html

const env = { region: 'us-east-1' };

// Create the Source Code Stack with a CodeCommit repo to host the front end and infrastructure code

const { codecommitRepo } = new SourceCodeStack(app, 'SourceCodeStack', {
  description: 'Source code resources including CodeCommit',
  env
});

// Create the Authentication Stack with a Cognito Identity Pool and an IAM Role for guest users to access AMB Query

const { identityPool, region, ambQueryRole } = new AuthenticationStack(app, 'AuthenticationStack', {
  description: 'Authentication resources including a Cognito Identity Pool',
  env
});

// Create the Front End Stack with Amplify to host our web app

new FrontEndStack(app, 'FrontEndStack', {
  description: 'Front End resources including Amplify',
  env,
  codecommitRepo,
  region,
  identityPool,
  ambQueryRole
});
