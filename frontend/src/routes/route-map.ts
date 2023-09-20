// This file exports a ROUTE_MAP used by the Router to define the elements (Views) that render on each route

import ROUTE_JSON from './routes.json';
import { AppRouteJson } from '../types/routes';
import * as VIEWS from '../components/views';
import { ViewProps } from '../components/layout/View';
import { pathToName, viewNameToComponentName } from '../utility/strings';

// For each route defined in JSON, return a map of paths to View Components

const appRoutes = ROUTE_JSON as AppRouteJson[];
const ROUTE_MAP = new Map<string, React.FC<ViewProps>>(
  appRoutes.map(({ path, name, viewComponentName }) => {
    if (!name) {
      name = pathToName(path);
    }

    if (!viewComponentName) {
      viewComponentName = viewNameToComponentName(name);
    }

    const viewName = `View${viewComponentName || 'Default'}`;
    const viewComponent = VIEWS[viewName];

    if (viewComponent) {
      return [path, viewComponent];
    }

    return [path, VIEWS['ViewDefault']];
  })
);

export default ROUTE_MAP;
