import {
  BriefcaseBusiness,
  CalendarDays,
  ChartNoAxesColumn,
  FileText,
  LayoutGrid,
} from 'lucide-react';
import type { MouseEvent } from 'react';

export const navigationItems = [
  { page: 'dashboard', label: 'Board', href: '/', icon: LayoutGrid },
  { page: 'jobs', label: 'Jobs', href: '/jobs', icon: BriefcaseBusiness },
  { page: 'calendar', label: 'Calendar', href: '/calendar', icon: CalendarDays },
  { page: 'analytics', label: 'Analytics', href: '/analytics', icon: ChartNoAxesColumn },
  { page: 'resumes', label: 'Resumes', href: '/resumes', icon: FileText },
] as const;

export type Page = (typeof navigationItems)[number]['page'];
export type Navigate = (page: Page) => void;

const navigationEvent = 'applywise:navigation';

export function getPageFromPath(path: string): Page | null {
  const normalizedPath = path.replace(/\/+$/, '') || '/';
  return navigationItems.find((item) => item.href === normalizedPath)?.page ?? null;
}

export function getCurrentPath() {
  return window.location.pathname;
}

export function subscribeToNavigation(onChange: () => void) {
  window.addEventListener('popstate', onChange);
  window.addEventListener(navigationEvent, onChange);

  return () => {
    window.removeEventListener('popstate', onChange);
    window.removeEventListener(navigationEvent, onChange);
  };
}

export function navigateToPage(page: Page) {
  const item = navigationItems.find((item) => item.page === page);
  if (!item || getCurrentPath() === item.href) return;

  window.history.pushState(null, '', item.href);
  window.dispatchEvent(new Event(navigationEvent));
}

export function handleNavigationClick(
  event: MouseEvent<HTMLAnchorElement>,
  page: Page,
  onNavigate: Navigate,
) {
  // Preserve browser behavior for opening links in another tab or window.
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

  event.preventDefault();
  onNavigate(page);
}
