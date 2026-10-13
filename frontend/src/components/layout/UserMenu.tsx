import { ChevronDown, CircleHelp, LogOut, Settings, UserRound } from 'lucide-react';
import type { RefObject } from 'react';

type UserMenuProps = {
  id: string;
  containerRef: RefObject<HTMLDivElement | null>;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
};

const accountActions = [
  { label: 'Profile', icon: UserRound },
  { label: 'Settings', icon: Settings },
  { label: 'Help & support', icon: CircleHelp },
];

export default function UserMenu({ id, containerRef, isOpen, onToggle, onClose }: UserMenuProps) {
  return (
    <div ref={containerRef} data-open={isOpen} className="group/user relative shrink-0">
      <button
        type="button"
        aria-label="Open user menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? id : undefined}
        onClick={onToggle}
        className="flex cursor-pointer items-center gap-2 rounded-2xl p-0.5 text-[#334155] transition-colors hover:bg-[#f0f3f6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 group-data-[open=true]/user:bg-blue-50 group-data-[open=true]/user:text-blue-600 sm:gap-3 sm:p-1 sm:pr-3 dark:text-slate-200 dark:hover:bg-[#273039] dark:group-data-[open=true]/user:bg-blue-500/15 dark:group-data-[open=true]/user:text-blue-300"
      >
        <span className="flex size-8 items-center justify-center rounded-full bg-[#eaeef2] text-sm font-semibold group-data-[open=true]/user:bg-blue-100 sm:size-9 dark:bg-[#8a9fb5] dark:text-white dark:group-data-[open=true]/user:bg-blue-500/30">JD</span>
        <ChevronDown className="hidden size-3.5 sm:block" strokeWidth={1.8} aria-hidden="true" />
      </button>
      {isOpen && (
        <div id={id} className="absolute right-0 top-[calc(100%+0.5rem)] w-64 rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.08)] dark:border-[#2b3540] dark:bg-[#101820]">
          {/* Sample identity until account data is connected. */}
          <div className="mb-4 flex items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#eaeef2] text-sm font-semibold dark:bg-[#8a9fb5] dark:text-white">JD</span>
            <div className="min-w-0">
              <p className="text-sm font-semibold">John Doe</p>
              <p className="truncate text-xs text-[#64748b] dark:text-slate-400">john@example.com</p>
            </div>
          </div>
          {/* Account actions dismiss the menu until account services are connected. */}
          <div className="flex flex-col gap-1">
            {accountActions.map(({ label, icon: Icon }) => (
              <button key={label} type="button" onClick={onClose} className="flex items-center gap-3 rounded-lg px-2 py-2 text-left text-sm text-[#334155] transition-colors hover:bg-[#f0f3f6] focus-visible:outline-2 focus-visible:outline-blue-500 dark:text-slate-200 dark:hover:bg-[#273039]">
                <Icon className="size-4" strokeWidth={1.8} aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>
          <div className="mt-3 border-t border-[#e2e8f0] pt-3 dark:border-[#2b3540]">
            <button type="button" onClick={onClose} className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-red-500 dark:text-red-400 dark:hover:bg-red-500/10">
              <LogOut className="size-4" strokeWidth={1.8} aria-hidden="true" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
