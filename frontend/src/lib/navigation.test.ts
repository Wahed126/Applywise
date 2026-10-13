import type { MouseEvent } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getCurrentPath,
  getPageFromPath,
  handleNavigationClick,
  navigateToPage,
  subscribeToNavigation,
} from './navigation';

describe('page navigation', () => {
  let location: { pathname: string };
  let pushState: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    const events = new EventTarget();
    location = { pathname: '/' };
    pushState = vi.fn((_state: unknown, _title: string, path: string) => {
      location.pathname = path;
    });
    vi.stubGlobal('window', {
      location,
      history: { pushState },
      addEventListener: events.addEventListener.bind(events),
      removeEventListener: events.removeEventListener.bind(events),
      dispatchEvent: events.dispatchEvent.bind(events),
    });
  });

  afterEach(() => vi.unstubAllGlobals());

  it.each([
    ['/', 'dashboard'],
    ['/jobs', 'jobs'],
    ['/jobs/', 'jobs'],
    ['/calendar', 'calendar'],
    ['/analytics', 'analytics'],
    ['/resumes', 'resumes'],
    ['/missing', null],
    ['/jobs/123', null],
  ])('resolves %s to %s', (path, expected) => {
    expect(getPageFromPath(path)).toBe(expected);
  });

  it('updates the URL and notifies the app when navigating', () => {
    const onChange = vi.fn();
    const unsubscribe = subscribeToNavigation(onChange);

    navigateToPage('jobs');

    expect(pushState).toHaveBeenCalledWith(null, '', '/jobs');
    expect(getCurrentPath()).toBe('/jobs');
    expect(onChange).toHaveBeenCalledOnce();
    unsubscribe();
  });

  it('does not add duplicate history entries for the current page', () => {
    navigateToPage('dashboard');
    expect(pushState).not.toHaveBeenCalled();
  });

  it('notifies the app on browser history changes and removes listeners on cleanup', () => {
    const onChange = vi.fn();
    const unsubscribe = subscribeToNavigation(onChange);

    location.pathname = '/jobs';
    window.dispatchEvent(new Event('popstate'));
    expect(onChange).toHaveBeenCalledOnce();
    expect(getPageFromPath(getCurrentPath())).toBe('jobs');

    unsubscribe();
    window.dispatchEvent(new Event('popstate'));
    navigateToPage('calendar');
    expect(onChange).toHaveBeenCalledOnce();
  });
});

describe('navigation links', () => {
  function createClick(overrides: Partial<MouseEvent<HTMLAnchorElement>> = {}) {
    return {
      button: 0,
      defaultPrevented: false,
      metaKey: false,
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
      preventDefault: vi.fn(),
      ...overrides,
    } as unknown as MouseEvent<HTMLAnchorElement>;
  }

  it('handles a regular click without reloading the document', () => {
    const event = createClick();
    const onNavigate = vi.fn();

    handleNavigationClick(event, 'jobs', onNavigate);

    expect(event.preventDefault).toHaveBeenCalledOnce();
    expect(onNavigate).toHaveBeenCalledWith('jobs');
  });

  it.each([
    { metaKey: true },
    { ctrlKey: true },
    { shiftKey: true },
    { altKey: true },
    { button: 1 },
    { defaultPrevented: true },
  ])('preserves native browser behavior for %o', (overrides) => {
    const event = createClick(overrides);
    const onNavigate = vi.fn();

    handleNavigationClick(event, 'jobs', onNavigate);

    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(onNavigate).not.toHaveBeenCalled();
  });
});
