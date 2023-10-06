# Digital Asset Portfolio Tracker

_React web application that utilizes Amazon Managed Blockchain Query to create a digital asset portfolio tracker for Bitcoin and Ethereum._

This repository contains the code for the Digital Asset Portoflio Tracker web application:

- AWS infrastructure as code written in TypeScript with the [AWS Cloud Development Kit (CDK)](https://aws.amazon.com/cdk/)
- Frontend web application written in React and TypeScript

## Project folder structure

`.vscode/`

- VS Code settings for the repository to improve developer experience

`frontend/`

- Source code and build tools for the frontend web app

`infrastructure/`

- AWS CDK project
- Source code and tools to deploy infrastructure on AWS

## Prerequisites

The below prerequisites are required to develop, build, and run both the `infrastracture` and `frontend` projects

1. Node.js >= v16.20.1: https://nodejs.org/en/download
2. An AWS account: https://docs.aws.amazon.com/accounts/latest/reference/manage-acct-creating.html
3. The AWS CLI: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
4. AWS CLI configured with your account credentials: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html

## Developer prerequisites

There are a few optional tools that can be used to enhance developer experience:

- VS Code
- VS Code extensions:

  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
    - Used to highlight and fix TypeScript code
  - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
    - Used to format code
    - If using VS Code, the `/.vscode/settings.json` file includes settings to format when pasting and saving code

  **NOTE:** There are git pre-commit hooks setup to automatically Lint and Format the code. Installing the above extensions will greatly improve this experience.

## Getting started

### Deploy the AWS Services for this project with the AWS CDK

Change into the `~/infrastructure/` directory of this repo:

```
  cd infrastructure
```

See [/infrastructure/README.md](/infrastructure/README.md) to get started.

### Develop and run the React JS web app locally

Change into the `~/frontend/` directory of this repo:

```
  cd frontend
```

See [/frontend/README.md](/frontend/README.md) to get started.
