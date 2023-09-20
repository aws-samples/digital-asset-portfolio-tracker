# AWS Portfolio Tracker

This repository contains the code for the AWS Portoflio web application:

- AWS infrastructure as code written in TypeScript with the AWS Cloud Development Kit (CDK)
- AWS Lambda functions written in JavaScript and/or TypeScript
- React frontend web application written in React and TypeScript

## Solution Overview

- Amazon Managed Blockchain Query
- Amazon Managed Blockchain Access
- AWS Lambda
- Amazon Cognito
- Amazon API Gateway
- AWS Amplify
- AWS CDK

## Project folder structure

`.vscode/`

- VS Code settings for the repository to improve developer experience

`frontend/`

- Source code and build tools for the front end web app

`infrastructure/`

- AWS CDK project
  - Source code and build tools to deploy infrastructure on AWS
- Lambda source code

## Prerequisites

The below prerequisites are required to develop, build, and run both the `infrastracture` and `frontend` projects

1. Node.js >= v16.20.1: https://nodejs.org/en/download
2. An AWS account: https://docs.aws.amazon.com/accounts/latest/reference/manage-acct-creating.html
3. The AWS CLI: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
4. AWS CLI configured with your account credentials: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html

## Getting started

### Infrastructure

Change into the `~/infrastructure/` directory of this repo:

```
  cd infrastructure
```

See the `README.md` file in `./infrastructure` to get started.

### Frontend

Change into the `~/frontend/` directory of this repo:

```
  cd frontend
```

See the `README.md` file in `./frontend` to get started.
