import * as codebuild from 'aws-cdk-lib/aws-codebuild';

const FRONTEND_DIRECTORY = 'frontend';

/**
 * Returns the CodeBuild BuildSpec needed to install, build, and deploy a default ViteJS web app
 */
export function getBuildSpecViteJs(): codebuild.BuildSpec {
  return codebuild.BuildSpec.fromObject({
    frontend: {
      phases: {
        preBuild: { commands: [`cd ${FRONTEND_DIRECTORY}`, 'npm ci'] },
        build: { commands: ['npm run build'] }
      },
      artifacts: {
        baseDirectory: `${FRONTEND_DIRECTORY}/dist`,
        files: ['**/*']
      },
      cache: {
        paths: [`${FRONTEND_DIRECTORY}/node_modules/**/*`]
      }
    }
  });
}
