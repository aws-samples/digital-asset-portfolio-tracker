import { Box, Paper, Stack, Typography } from '@mui/material';
import View, { ViewProps } from './View';

type LandingPageProps = ViewProps;

export default function LandingPage({ children }: LandingPageProps) {
  const title = 'Welcome';
  const subtitle = 'Please enter a Bitcoin or Ethereum address to get started';

  return (
    <View sx={{ alignItems: 'center' }} headline={title} subtitle={subtitle}>
      <Paper
        sx={{
          p: 4,
          display: 'grid',
          gap: 4
        }}
      >
        <Box>
          <Stack direction='row'>
            <Typography variant='h4'>{title}</Typography>
          </Stack>
          <p>{subtitle}</p>
        </Box>
        {children}
      </Paper>
    </View>
  );
}
