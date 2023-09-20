import { RouteObject } from 'react-router-dom';

export type AppRouteJson = {
  path: string;
  name?: string;
  viewComponentName?: string;
  description?: string;
  showInHeader?: boolean;
  hideHeadline?: boolean;
  icon?: string;
  requireAccount?: boolean;
};

export type AppRoute = RouteObject & AppRouteJson;
