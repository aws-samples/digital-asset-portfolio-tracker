import ButtonLink, { ButtonLinkProps } from './ButtonLink';

export default function ButtonLogo(props: ButtonLinkProps) {
  return (
    <ButtonLink
      sx={{
        gap: 2,
        color: 'text.primary',
        '&:hover': {
          bgcolor: 'transparent'
        }
      }}
      {...props}
    />
  );
}
