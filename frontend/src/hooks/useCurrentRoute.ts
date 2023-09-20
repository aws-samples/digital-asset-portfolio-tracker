import { matchRoutes, useLocation } from 'react-router-dom';
import useRoutes from './useRoutes';

export default function useCurrentRoute() {
  const routes = useRoutes();
  const location = useLocation();
  const routeMatch = matchRoutes(routes, location);

  if (routeMatch) {
    return routeMatch[0].route;
  }

  return null;
}
