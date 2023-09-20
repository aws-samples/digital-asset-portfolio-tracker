import { Construct } from 'constructs';
import * as amplify from '@aws-cdk/aws-amplify-alpha';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import { getBuildSpecViteJs } from './codebuild';

/**
 * Creates an Amplify app
 */
export function createAmplifyApp(
  scope: Construct,
  appName: string,
  amplifyAppOptions: amplify.AppProps
): amplify.App {
  const amplifyApp = new amplify.App(scope, appName, amplifyAppOptions);

  return amplifyApp;
}

/**
 * Creates an Amplify app from a CodeCommit repo
 */
export function createAmplifyAppFromCodeCommit(
  scope: Construct,
  appName: string,
  codecommitRepo: codecommit.Repository,
  amplifyAppOptions?: amplify.AppProps
): amplify.App {
  return createAmplifyApp(scope, appName, {
    ...amplifyAppOptions,
    sourceCodeProvider: new amplify.CodeCommitSourceCodeProvider({
      repository: codecommitRepo
    })
  });
}

/**
 * Creates an Amplify Pipeline to build and deploy an app when commit are made to the specified branch name
 */
export function createAmplifyBuildPipeline(amplifyApp: amplify.App, branchName: string) {
  return amplifyApp.addBranch(branchName);
}

/**
 * Creates an Amplify App and Pipeline for a ViteJS SPA hosted in CodeCommit
 */
export function createAmplifyPipelineFromCodeCommitViteJsSpa(
  scope: Construct,
  appName: string,
  codecommitRepo: codecommit.Repository,
  pipelineBranchName: string,
  amplifyAppOptions?: amplify.AppProps
): { amplifyApp: amplify.App; pipeline: amplify.Branch } {
  const amplifyApp = createAmplifyAppFromCodeCommit(scope, appName, codecommitRepo, {
    ...amplifyAppOptions,
    buildSpec: getBuildSpecViteJs(),
    customRules: [
      ...(amplifyAppOptions?.customRules || []),
      amplify.CustomRule.SINGLE_PAGE_APPLICATION_REDIRECT
    ]
  });

  const pipeline = createAmplifyBuildPipeline(amplifyApp, pipelineBranchName);

  return { amplifyApp, pipeline };
}
