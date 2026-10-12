import {
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  ChartNoAxesColumn,
  ChevronDown,
  CircleHelp,
  FileText,
  LayoutGrid,
  LogOut,
  Menu,
  Plus,
  Search,
  Settings,
  UserRound,
  X,
} from 'lucide-react';

import type { LucideIcon } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';

import NavItem from './NavItem';

type HeaderProps = {
  // The layout supplies the current URL path to highlight the matching link.
  currentPath: string;
};

type NavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

type HeaderPanel = 'navigation' | 'search' | 'user' | null;

type SearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
};

// Both desktop and mobile navigation use the same links and icons.
const navigation: NavigationItem[] = [
  { label: 'Board', href: '/', icon: LayoutGrid },
  { label: 'Jobs', href: '/jobs', icon: BriefcaseBusiness },
  { label: 'Calendar', href: '/calendar', icon: CalendarDays },
  { label: 'Analytics', href: '/analytics', icon: ChartNoAxesColumn },
  { label: 'Resumes', href: '/resumes', icon: FileText },
];

// Shared sizing, hover, keyboard-focus, and dark-mode styles for icon controls.
const iconButtonClasses = 'flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-xl text-[#334155] transition-colors hover:bg-[#f0f3f6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 sm:size-10 dark:text-slate-200 dark:hover:bg-[#273039]';

// Reused inline and in the search dropdown; filtering is not connected yet.
function SearchField({ value, onChange, autoFocus = false }: SearchFieldProps) {
  return (
    <label className="flex h-11 w-full items-center gap-3 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-3 text-[#475569] transition-shadow focus-within:border-blue-400 focus-within:ring-3 focus-within:ring-blue-100 dark:border-[#3b4650] dark:bg-[#1b242c] dark:text-slate-300 dark:focus-within:ring-blue-500/20">
      <Search className="size-5 shrink-0" strokeWidth={1.8} aria-hidden="true" />
      <input
        type="search"
        aria-label="Search applications"
        placeholder="Search applications..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoFocus={autoFocus}
        className="min-w-0 flex-1 bg-transparent text-sm text-[#101820] outline-none placeholder:text-[#64748b] dark:text-white dark:placeholder:text-slate-400"
      />
      {/* Visual shortcut hint only; no keyboard shortcut is registered yet. */}
      <span aria-hidden="true" className="hidden shrink-0 rounded-md bg-[#eef2f6] px-1.5 py-0.5 text-xs text-[#64748b] sm:inline-flex dark:bg-[#2b3540] dark:text-slate-300">
        ⌘ K
      </span>
    </label>
  );
}

export default function Header({ currentPath }: HeaderProps) {
  // A single panel state prevents overlapping menus; search text survives closing.
  const [openPanel, setOpenPanel] = useState<HeaderPanel>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigationRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const id = useId();

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

      <div className="flex h-16 items-center gap-2 px-3 sm:gap-4 sm:px-5 xl:gap-6">

        {/* Below 1280px, React state toggles the navigation and its menu/close icon. */}
        <div ref={navigationRef} className="xl:hidden">

          <button type="button" aria-label="Toggle navigation" aria-expanded={openPanel === 'navigation'} aria-controls={`${id}-navigation`} onClick={() => togglePanel('navigation')} className={iconButtonClasses}>
            {openPanel === 'navigation'
              ? <X className="size-5" strokeWidth={1.8} aria-hidden="true" />
              : <Menu className="size-5" strokeWidth={1.8} aria-hidden="true" />}
          </button>

          {openPanel === 'navigation' && (
            <nav id={`${id}-navigation`} aria-label="Mobile navigation" onClick={() => setOpenPanel(null)} className="absolute inset-x-0 top-[calc(100%+0.5rem)] flex flex-col gap-1 rounded-2xl border border-[#e2e8f0] bg-white p-3 shadow-lg shadow-slate-900/5 dark:border-[#2b3540] dark:bg-[#101820]">
              {navigation.map((item) => (
                <NavItem key={item.href} {...item} isActive={currentPath === item.href} />
              ))}
            </nav>
          )}
        </div>

        {/* Brand link returns to the board; the SVG is a decorative logo. */}
        <a
          href="/"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md text-base font-bold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500 sm:gap-2.5 sm:text-xl"
        >
          <svg viewBox="0 0 32 32" fill="none" className="size-6 sm:size-8" aria-hidden="true">
            <path d="M5 26 14.2 6.5a2 2 0 0 1 3.6 0L27 26M17 19l7 3" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          ApplyWise
        </a>
        {/* From 1280px, show the horizontal navigation instead of the mobile menu. */}
        <nav className="hidden items-center gap-1 xl:flex" aria-label="Main navigation">
          {navigation.map((item) => (
            <NavItem key={item.href} {...item} isActive={currentPath === item.href} />
          ))}
        </nav>

        {/* Push search, notifications, user menu, and the primary action to the right. */}
        <div className="ml-auto flex min-w-0 items-center gap-1 sm:gap-3 xl:gap-4">
          {/* Inline search starts at 1536px; narrower screens use the dropdown below. */}
          <div className="hidden w-64 2xl:block min-[1800px]:w-80">
            <SearchField value={searchQuery} onChange={setSearchQuery} />
          </div>
          <div ref={searchRef} className="2xl:hidden">
            <button type="button" aria-label="Open application search" aria-expanded={openPanel === 'search'} aria-controls={`${id}-search`} onClick={() => togglePanel('search')} className={iconButtonClasses}>
              <Search className="size-5" strokeWidth={1.8} aria-hidden="true" />
            </button>
            {openPanel === 'search' && (
              <div id={`${id}-search`} className="absolute inset-x-0 top-[calc(100%+0.5rem)] rounded-2xl border border-[#e2e8f0] bg-white p-3 shadow-lg shadow-slate-900/5 sm:left-auto sm:w-80 dark:border-[#2b3540] dark:bg-[#101820]">
                <SearchField value={searchQuery} onChange={setSearchQuery} autoFocus />
              </div>
            )}
          </div>

          {/* The unread dot is a static design placeholder. */}
          <button type="button" aria-label="Notifications, unread notifications" className={`relative ${iconButtonClasses}`}>
            <Bell className="size-5" strokeWidth={1.8} aria-hidden="true" />
            <span className="absolute top-2 right-2 size-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#101820]" />
          </button>

          {/* React state controls the user menu and its data-open styling. */}
          <div ref={userRef} data-open={openPanel === 'user'} className="group/user relative shrink-0">
            <button type="button" aria-label="Open user menu" aria-expanded={openPanel === 'user'} aria-controls={`${id}-user`} onClick={() => togglePanel('user')} className="flex cursor-pointer items-center gap-2 rounded-2xl p-0.5 text-[#334155] transition-colors hover:bg-[#f0f3f6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 group-data-[open=true]/user:bg-blue-50 group-data-[open=true]/user:text-blue-600 sm:gap-3 sm:p-1 sm:pr-3 dark:text-slate-200 dark:hover:bg-[#273039] dark:group-data-[open=true]/user:bg-blue-500/15 dark:group-data-[open=true]/user:text-blue-300">
              <span className="flex size-8 items-center justify-center rounded-full bg-[#eaeef2] text-sm font-semibold group-data-[open=true]/user:bg-blue-100 sm:size-9 dark:bg-[#8a9fb5] dark:text-white dark:group-data-[open=true]/user:bg-blue-500/30">JD</span>
              <ChevronDown className="hidden size-4 sm:block" strokeWidth={1.8} aria-hidden="true" />
            </button>
            {openPanel === 'user' && (
              <div id={`${id}-user`} className="absolute right-0 top-[calc(100%+0.5rem)] w-64 rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.08)] dark:border-[#2b3540] dark:bg-[#101820]">
                {/* Sample identity until account data is connected. */}
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#eaeef2] text-sm font-semibold dark:bg-[#8a9fb5] dark:text-white">JD</span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">John Doe</p>
                    <p className="truncate text-xs text-[#64748b] dark:text-slate-400">john@example.com</p>
                  </div>
                </div>
                {/* Account actions currently dismiss the menu; account services are not connected. */}
                <div className="flex flex-col gap-1">
                  {[
                    { label: 'Profile', icon: UserRound },
                    { label: 'Settings', icon: Settings },
                    { label: 'Help & support', icon: CircleHelp },
                  ].map(({ label, icon: Icon }) => (
                    <button key={label} type="button" onClick={() => setOpenPanel(null)} className="flex items-center gap-3 rounded-lg px-2 py-2 text-left text-sm text-[#334155] transition-colors hover:bg-[#f0f3f6] focus-visible:outline-2 focus-visible:outline-blue-500 dark:text-slate-200 dark:hover:bg-[#273039]">
                      <Icon className="size-5" strokeWidth={1.8} aria-hidden="true" />
                      {label}
                    </button>
                  ))}
                </div>
                <div className="mt-3 border-t border-[#e2e8f0] pt-3 dark:border-[#2b3540]">
                  <button type="button" onClick={() => setOpenPanel(null)} className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-red-500 dark:text-red-400 dark:hover:bg-red-500/10">
                    <LogOut className="size-5" strokeWidth={1.8} aria-hidden="true" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Desktop application action; its click handler is not connected yet. */}
          <button type="button" className="hidden h-11 shrink-0 items-center gap-3 rounded-xl bg-[#101820] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#26313b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 xl:inline-flex dark:bg-white dark:text-[#101820] dark:hover:bg-slate-100">
            <Plus className="size-4" strokeWidth={1.8} aria-hidden="true" />
            Add application
            <ChevronDown className="ml-1 size-4" strokeWidth={1.8} aria-hidden="true" />
          </button>
        </div>

      </div>
    </header>
  );
}
