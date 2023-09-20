import {
  Box,
  BoxProps,
  CircularProgress,
  Container,
  IconButton,
  Stack,
  Typography
} from '@mui/material';
import { ReactNode } from 'react';
import { AppRoute } from '../../types/routes';
import { matchRoutes, useLocation, useNavigate } from 'react-router-dom';
import { appRoutes } from './Router';
import { pathToName } from '../../utility/strings';
import { ArrowBack } from '@mui/icons-material';

export type ViewProps = BoxProps & {
  headline?: ReactNode;
  subtitle?: string;
  hideHeadline?: boolean;
  isLoading?: boolean;
};

/**
 * The View layout component sits inside the Workspace and contains Widgets
 */
const View: React.FC<ViewProps> = ({
  headline,
  subtitle,
  hideHeadline = false,
  isLoading = false,
  children,
  sx,
  ...props
}: ViewProps) => {
  // Get route definition

  const location = useLocation();
  const routeMatch = matchRoutes(appRoutes, location);
  let route: AppRoute;

  if (routeMatch) {
    route = routeMatch[0].route as AppRoute;
  }

  // Set headline

  if (route && !headline) {
    headline = route.name || pathToName(route.path);
  }

  // To go back with back button in headline

  const navigate = useNavigate();

  // Show back button in some View headlines

  // TODO: Check if there's been any in-app navigation to show back button.
  // This will require creating some shared route() method (instead of <Link> elements or useNavigate() calls), adding state{}

  let showBackButton = !!route;

  if (location.pathname == '/') {
    showBackButton = false;
    hideHeadline = true;
  }

  let elHeadline = null;

  if (!hideHeadline) {
    let title;

    if (typeof headline == 'string') {
      title = (
        <Typography variant='h4' noWrap>
          {headline}
        </Typography>
      );
    } else {
      title = headline;
    }

    elHeadline = (
      <Stack direction='row' gap={2}>
        {showBackButton && (
          <IconButton sx={{ mt: -1.5 }}>
            <ArrowBack onClick={() => navigate(-1)} sx={{ fontSize: '1.5em' }} />
          </IconButton>
        )}
        <Stack gap={2}>
          {title}
          <Typography color='text.secondary'>{subtitle}</Typography>
        </Stack>
      </Stack>
    );
  }

  return (
    <Container
      disableGutters
      sx={{
        display: 'grid',
        gap: 4
      }}
    >
      <Box width='100%'>{elHeadline}</Box>
      <Box
        sx={{
          flex: 1,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          ...sx
        }}
        {...props}
      >
        {isLoading ? <CircularProgress sx={{ alignSelf: 'center' }} /> : children}
      </Box>
    </Container>
  );
};

export default View;
