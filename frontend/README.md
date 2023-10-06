# Digital Asset Portfolio Tracker Frontend

This project contains the Digital Asset Portfolio Tracker single page web application written in React and TypeScript.

## Project overview

This project builds a web app with the following technologies:

- Vite
  - JavaScript source code tooling and bundler
  - https://vitejs.dev/
- React
  - JavaScript library
  - https://react.dev/
- ReactRouter
  - Single page app routing
  - https://reactrouter.com/
- MUI React Component Library
  - https://mui.com/

## Project folder structure

`public/`

- Static files such as images

`src/`

- React source code
  - `main.tsx`
    - App entry point
    - Mounts Context Providers
  - `App.tsx`
    - Main App Component
  - `components/`
    - React components
    - `layout/`
      - Components used to define the app layout
    - `views/`
      - Components rendered at each route
    - `widgets/`
      - Low level React components that make up a View
  - `config/`
    - Configuration files and functions
    - `aws/`
      - `amb-query.ts`
        - Wrappers to configure the Amazon Managed Blockchain Query SDK Client
  - `context/`
    - React Contexts
  - `hooks/`
    - React Hooks
  - `routes/`
    - App routes
    - Defines all routes of the app and which Views they render
  - `services/`
    - Wrappers to make requests to various APIs
    - `amb-query/`
      - Wrappers to make requests to Amazon Managed Blockchain Query using the SDK Client
  - `theme/`
    - App theme
  - `types/`
    - Type definitions
  - `utility/`
    - Generic helper functions

`index.html`

- Main application HTML file

`.env.sample`

- Sample `.env` file that contains all necessary environment variables to run the app
- See `Environment variables` section below

`vite.config.ts`

- Defines Vite configuration

## Prerequisites

**See the [project README](../README.md) and [infrastructure README](../infrastructure/README.md)**

## Getting started

1.  Install dependencies

    ```
    npm install
    ```

### Environment variables

This project is reliant on environment variables for configuration, mainly the IDs of various AWS resources like the Cognito Identity Pool and IAM Role ARNs. During development, environment variables are defined by a gitignored-file `.env`. When the web application is running on AWS, AWS Amplify is configured with these same environment variables set by the CDK.

- To create your `.env` file, copy the contents of `.env.sample` and paste them into a new file named `.env` in this folder
- The values for each variable are empty, replace them with the values from the AWS resources deployed in your AWS account
  - See the [infrastructure README](../infrastructure/README.md) for steps on deploying the AWS resources
- All of the values are available in the AWS Amplify Console:
  - Navigate to the AWS Console and login
  - Search for `AWS Amplify` and select it
  - Select the Amplify app for this app
  - On the side navigation, select `Environment Variables` under the `App settings` accordian
  - Find each environemt variable found in `.env` and copy & paste it into your `.env` file

## Development

```
npm run dev
```

- Runs the app in development mode
- Should open a browser window to [http://localhost:5173](http://localhost:5173)
- Live updates as files are saved

## Deployment

This app is deployed automatically when commits are made to the repository and you should rarely need to manually deploy the application. This is made possible by AWS Amplify, see [the the infrastructure README](../infrastructure/README.md) for more info. If you're curious about the build process, the below command is ran to bundle the React source code into static code optimized for the browser. The static code files are then hosted by Amplify:

```
npm run build
```

See the Vite docs for more: https://vitejs.dev/guide/build.html
