import { LoadingButton, LoadingButtonProps } from '@mui/lab';

interface ButtonPrimaryProps extends LoadingButtonProps {
  loading?: boolean;
}

const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({
  sx,
  type = 'button',
  children,
  loading = false,
  startIcon,
  href,
  onClick,
  ...props
}: ButtonPrimaryProps) => {
  return (
    <LoadingButton
      startIcon={startIcon}
      loading={loading}
      type={type}
      onClick={onClick}
      href={href}
      variant='contained'
      sx={{ textTransform: 'none', ...sx }}
      {...props}
    >
      {children}
    </LoadingButton>
  );
};

export default ButtonPrimary;
