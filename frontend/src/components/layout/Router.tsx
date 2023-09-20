import ROUTE_JSON from '../../routes/routes.json';
import ROUTE_MAP from '../../routes/route-map';
import {
  createBrowserRouter,
  RouteObject,
  RouterProvider,
  RouterProviderProps
} from 'react-router-dom';
import App from '../../App';
import ViewError from '../views/Error';
import { ViewProps } from './View';
import { AppRouteJson, AppRoute } from '../../types/routes';
import AppLayout from './AppLayout';
import { pathToName } from '../../utility/strings';

// This file exports a React Router RouteProvider with a BrowserRouter.

// Generate the app's ReactRouter routes from routes.json

function appRouteToReactRouter({
  path,
  name,
  icon = 'InfoTwoTone',
  description,
  hideHeadline = false,
  showInHeader = false,
  requireAccount = true
}: AppRouteJson): AppRoute {
  // Get the View component for the route

  if (!name) {
    name = pathToName(path);
  }

  const ViewComponent: React.FC<ViewProps> = ROUTE_MAP.get(path) as React.FC<ViewProps>;

  if (!ViewComponent) {
    throw new Error(`View component for route ${path} not defined in ROUTE_MAP.`);
  }

  // Add props to the View component

  const viewProps = { headline: name, subtitle: description, hideHeadline };

  return {
    element: <ViewComponent {...viewProps} />,
    path,
    name,
    icon,
    description,
    hideHeadline,
    showInHeader,
    requireAccount
  };
}

const routeJson = ROUTE_JSON as AppRouteJson[];

export const appRoutes: AppRoute[] = routeJson.map((appRouteJson: AppRouteJson) => {
  return appRouteToReactRouter(appRouteJson);
});

// Add the app's routes as children of a "main" router within the App's layout. This allows the main app layout to persist across each View.

const routeForContextAndLayout: RouteObject[] = [
  {
    element: <App />,
    errorElement: (
      <AppLayout>
        <ViewError />
      </AppLayout>
    ),
    children: appRoutes
  }
];

// Create ReactRouter BrowserRouter: https://reactrouter.com/en/main/routers/create-browser-router

const browserRouter = createBrowserRouter(routeForContextAndLayout);

export type RouterProps = Omit<RouterProviderProps, 'router'>;

const Router: React.FC<RouterProps> = (props: RouterProps) => {
  return <RouterProvider {...props} router={browserRouter} />;
};

export default Router;
