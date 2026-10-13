import { useSyncExternalStore } from 'react';
import {
  getCurrentPath,
  getPageFromPath,
  navigateToPage,
  subscribeToNavigation,
} from '../lib/navigation';

export default function useNavigation() {
  const currentPath = useSyncExternalStore(subscribeToNavigation, getCurrentPath);

  return {
    currentPage: getPageFromPath(currentPath),
    onNavigate: navigateToPage,
  };
}
