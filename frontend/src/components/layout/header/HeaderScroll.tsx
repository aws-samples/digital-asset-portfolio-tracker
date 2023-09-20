import { useScrollTrigger } from '@mui/material';
import { cloneElement } from 'react';

type HeaderScrollProps = {
  children: React.ReactElement;
};

/**
 * Elevates the header if the app is scrolled down
 */
const HeaderScroll: React.FC<HeaderScrollProps> = ({ children }: HeaderScrollProps) => {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0
  });

  return cloneElement(children, {
    elevation: trigger ? 4 : 0
  });
};

export default HeaderScroll;
