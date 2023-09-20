import { useState } from 'react';
import { useRunOnce } from './useRunOnce';
import { getCognitoCredentials } from '../services/cognito';
import { Credentials } from 'aws-sdk';

type UseCognitoCredentials = {
  isLoading: boolean;
  error: Error | null;
  credentials: Credentials | null;
};

/**
 * Get credentials for an IAM Role as an unauthenticated Identity of a Cognito Identity Pool
 */
export default function useCognitoCredentials(): UseCognitoCredentials {
  const [isLoading, setIsLoading] = useState<UseCognitoCredentials['isLoading']>(true);
  const [error, setError] = useState<UseCognitoCredentials['error']>(null);
  const [credentials, setCredentials] = useState<UseCognitoCredentials['credentials']>(null);

  // Get credentials from the Identity Pool

  useRunOnce(async () => {
    const cognitoConfig: {
      region: string;
      identityPoolId: string;
    } = {
      region: import.meta.env.VITE_AWS_REGION || '',
      identityPoolId: import.meta.env.VITE_AWS_COGNITO_IDENTITY_POOL_ID || ''
    };

    if ([...Object.values(cognitoConfig)].filter((value) => !value).length) {
      const error = new Error('Invalid environment variable setup');

      console.error(error);

      setError(error);
      setIsLoading(false);
    } else {
      try {
        const cognitoCredentials = await getCognitoCredentials();

        setCredentials(cognitoCredentials);
      } catch (err) {
        const error = new Error('Failed to authenticate with Cognito');

        console.error(error, err);

        setError(error);
      } finally {
        setIsLoading(false);
      }
    }
  });

  return { isLoading, error, credentials };
}
