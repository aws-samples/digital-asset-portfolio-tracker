import { Container, ContainerProps } from '@mui/material';

/**
 * The Workspace layout component sits below the app Header and contains the View
 * The View is defined by the Route
 */
const Workspace: React.FC<ContainerProps> = ({ children, sx }: ContainerProps) => {
  return <Container sx={sx}>{children}</Container>;
};

export default Workspace;
