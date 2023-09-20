import { Construct } from 'constructs';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';

/**
 * Initializes a CodeCommit repository
 */
export function createCodeCommitRepo(
  scope: Construct,
  repoName: string,
  repoOptions?: codecommit.RepositoryProps
): codecommit.Repository {
  const repository = new codecommit.Repository(scope, repoName, {
    ...repoOptions,
    repositoryName: repoName
  });

  return repository;
}
