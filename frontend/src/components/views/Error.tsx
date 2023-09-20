import View from '../layout/View';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import { Alert, AlertTitle, Container } from '@mui/material';
import ButtonPrimary from '../widgets/buttons/ButtonPrimary';

export default function ViewError({ error }: { error?: Error | null }) {
  const routerError = useRouteError();

  if (routerError) {
    error = routerError as Error;
  }

  console.error(error);

  let status = 500;
  let statusText = 'Unexpected error';
  let message = error.message || 'If this issue persists, please contact support';

  if (isRouteErrorResponse(error)) {
    status = error.status;
    statusText = error.statusText;
  }

  switch (status) {
    case 404:
      message = 'The page you visited does not exist';
      break;
    case 403:
    case 401:
      message = 'You are not authorized to access this page';
      break;
  }

  return (
    <View>
      <Container>
        <Alert
          severity='error'
          action={
            <ButtonPrimary onClick={() => (window.location.href = '/')}>Go home</ButtonPrimary>
          }
        >
          <AlertTitle>{statusText}</AlertTitle>
          {message}
        </Alert>
      </Container>
    </View>
  );
}
