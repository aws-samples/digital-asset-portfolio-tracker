import { useMediaQuery } from '@mui/material';

export function useResponsiveLayout() {
  const shouldCollapseHeader = useMediaQuery('(max-width:42em)');

  return { shouldCollapseHeader };
}
