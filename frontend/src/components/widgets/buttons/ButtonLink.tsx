import { ButtonProps, Button } from '@mui/material';
import { Link as ReactRouterLink } from 'react-router-dom';

export type ButtonLinkProps = ButtonProps & {
  to: string;
  target?: string;
};

const ButtonLink: React.FC<ButtonLinkProps> = ({
  to,
  children,
  sx,
  color,
  variant = 'text',
  startIcon,
  target
}: ButtonLinkProps) => {
  return (
    <Button
      sx={{
        display: 'flex',
        alignItems: 'center',
        textTransform: 'none',
        ...sx
      }}
      component={ReactRouterLink}
      to={to}
      variant={variant}
      color={color}
      startIcon={startIcon}
      target={target}
    >
      {children}
    </Button>
  );
};

export default ButtonLink;
