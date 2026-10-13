import { Bell, ChevronDown, Menu, Plus, Search, X } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { handleNavigationClick, navigationItems } from '../../lib/navigation';
import type { Navigate, Page } from '../../lib/navigation';
import NavItem from './NavItem';
import SearchField from './SearchField';
import UserMenu from './UserMenu';

type HeaderProps = {
  currentPage: Page | null;
  onNavigate: Navigate;
};

type HeaderPanel = 'navigation' | 'search' | 'user' | null;

// Shared sizing, hover, keyboard-focus, and dark-mode styles for icon controls.
const iconButtonClasses = 'flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-xl text-[#334155] transition-colors hover:bg-[#f0f3f6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 sm:size-10 dark:text-slate-200 dark:hover:bg-[#273039]';

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  // A single panel state prevents overlapping menus; search text survives closing.
  const [openPanel, setOpenPanel] = useState<HeaderPanel>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigationRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const id = useId();

  function navigate(page: Page) {
    setOpenPanel(null);
    onNavigate(page);
  }

  function togglePanel(panel: Exclude<HeaderPanel, null>) {
    setOpenPanel((current) => current === panel ? null : panel);
  }

  // Dismiss the active panel outside its container or with Escape, and clean up listeners.
  useEffect(() => {
    if (!openPanel) return;

    const panelRef = {
      navigation: navigationRef,
      search: searchRef,
      user: userRef,
    }[openPanel];

    function handlePointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !panelRef.current?.contains(event.target)) {
        setOpenPanel(null);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpenPanel(null);
        panelRef.current?.querySelector('button')?.focus();
      }
    }

    // Close responsive panels when their triggers disappear at desktop breakpoints.
    function handleResize() {
      if (
        (openPanel === 'navigation' && window.matchMedia('(min-width: 1280px)').matches) ||
        (openPanel === 'search' && window.matchMedia('(min-width: 1536px)').matches)
      ) {
        setOpenPanel(null);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [openPanel]);

  return (
    <header className="relative z-20 mx-auto rounded-2xl border border-[#e2e8f0] bg-white text-[#101820] shadow-[0_1px_2px_rgba(15,23,42,0.02)] dark:border-[#2b3540] dark:bg-[#101820] dark:text-white">

      <div className="flex h-14 items-center gap-1.5 px-2 sm:gap-3 sm:px-3 xl:gap-4">

        {/* Below 1280px, React state toggles the navigation and its menu/close icon. */}
        <div ref={navigationRef} className="xl:hidden">

          <button type="button" aria-label="Toggle navigation" aria-expanded={openPanel === 'navigation'} aria-controls={openPanel === 'navigation' ? `${id}-navigation` : undefined} onClick={() => togglePanel('navigation')} className={iconButtonClasses}>
            {openPanel === 'navigation'
              ? <X className="size-4" strokeWidth={1.8} aria-hidden="true" />
              : <Menu className="size-4" strokeWidth={1.8} aria-hidden="true" />}
          </button>

          {openPanel === 'navigation' && (
            <nav id={`${id}-navigation`} aria-label="Mobile navigation" className="absolute inset-x-0 top-[calc(100%+0.5rem)] flex flex-col gap-1 rounded-2xl border border-[#e2e8f0] bg-white p-3 shadow-lg shadow-slate-900/5 dark:border-[#2b3540] dark:bg-[#101820]">
              {navigationItems.map((item) => (
                <NavItem key={item.href} {...item} isActive={currentPage === item.page} onNavigate={navigate} />
              ))}
            </nav>
          )}
        </div>

        {/* Brand link returns to the board; the SVG is a decorative logo. */}
        <a
          href="/"
          onClick={(event) => handleNavigationClick(event, 'dashboard', navigate)}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md text-base font-bold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500 sm:gap-2.5 sm:text-xl"
        >
          <svg viewBox="0 0 32 32" fill="none" className="size-5 sm:size-7" aria-hidden="true">
            <path d="M5 26 14.2 6.5a2 2 0 0 1 3.6 0L27 26M17 19l7 3" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          ApplyWise
        </a>
        {/* From 1280px, show the horizontal navigation instead of the mobile menu. */}
        <nav className="hidden items-center gap-1 xl:flex" aria-label="Main navigation">
          {navigationItems.map((item) => (
            <NavItem key={item.href} {...item} isActive={currentPage === item.page} onNavigate={navigate} />
          ))}
        </nav>

        {/* Push search, notifications, user menu, and the primary action to the right. */}
        <div className="ml-auto flex min-w-0 items-center gap-1 sm:gap-2 xl:gap-3">
          {/* Inline search starts at 1536px; narrower screens use the dropdown below. */}
          <div className="hidden w-64 2xl:block min-[1800px]:w-80">
            <SearchField value={searchQuery} onChange={setSearchQuery} />
          </div>
          <div ref={searchRef} className="2xl:hidden">
            <button type="button" aria-label="Open application search" aria-expanded={openPanel === 'search'} aria-controls={openPanel === 'search' ? `${id}-search` : undefined} onClick={() => togglePanel('search')} className={iconButtonClasses}>
              <Search className="size-4" strokeWidth={1.8} aria-hidden="true" />
            </button>
            {openPanel === 'search' && (
              <div id={`${id}-search`} className="absolute inset-x-0 top-[calc(100%+0.5rem)] rounded-2xl border border-[#e2e8f0] bg-white p-3 shadow-lg shadow-slate-900/5 sm:left-auto sm:w-80 dark:border-[#2b3540] dark:bg-[#101820]">
                <SearchField value={searchQuery} onChange={setSearchQuery} autoFocus />
              </div>
            )}
          </div>

          {/* The unread dot is a static design placeholder. */}
          <button type="button" aria-label="Notifications, unread notifications" className={`relative ${iconButtonClasses}`}>
            <Bell className="size-4" strokeWidth={1.8} aria-hidden="true" />
            <span className="absolute top-2 right-2 size-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#101820]" />
          </button>

          <UserMenu
            id={`${id}-user`}
            containerRef={userRef}
            isOpen={openPanel === 'user'}
            onToggle={() => togglePanel('user')}
            onClose={() => setOpenPanel(null)}
          />

          {/* Desktop application action; its click handler is not connected yet. */}
          <button type="button" className="hidden h-9 shrink-0 items-center gap-2 rounded-xl bg-[#101820] px-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#26313b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 xl:inline-flex dark:bg-white dark:text-[#101820] dark:hover:bg-slate-100">
            <Plus className="size-3.5" strokeWidth={1.8} aria-hidden="true" />
            Add application
            <ChevronDown className="ml-1 size-3.5" strokeWidth={1.8} aria-hidden="true" />
          </button>
        </div>

      </div>
    </header>
  );
}
