import { useLocation } from 'react-router-dom';
import { useRunOnChange } from './useRunOnChange';

/**
 * Scrolls to the top of the page each time the app route is updated.
 * This is needed because our app is a SPA, so the browser maintains scroll position during routing.
 */
export function useScrollToTop() {
  const { pathname } = useLocation();

  useRunOnChange(() => {
    window.scrollTo(0, 0);
  }, pathname);
}
