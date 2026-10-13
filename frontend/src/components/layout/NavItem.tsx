import type { LucideIcon } from 'lucide-react';
import { handleNavigationClick } from '../../lib/navigation';
import type { Navigate, Page } from '../../lib/navigation';

type NavItemProps = {
  label: string;
  href: string;
  page: Page;
  onNavigate: Navigate;
  isActive?: boolean;
  icon?: LucideIcon;
};

export default function NavItem({
  label,
  href,
  page,
  onNavigate,
  isActive = false,
  icon: Icon,
}: NavItemProps) {
  return (
    <a
      href={href}
      onClick={(event) => handleNavigationClick(event, page, onNavigate)}
      aria-current={isActive ? 'page' : undefined}
      className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 xl:rounded-2xl xl:px-3 xl:py-2 ${isActive ? 'bg-[#eaeef2] font-semibold text-[#101820] dark:bg-[#273039] dark:text-white' : 'font-medium text-[#475569] hover:bg-[#f0f3f6] hover:text-[#101820] dark:text-[#cbd5e1] dark:hover:bg-[#202a33] dark:hover:text-white'}`}
    >
      {Icon && <Icon className="size-4 shrink-0" strokeWidth={1.8} aria-hidden="true" />}
      {label}
    </a>
  );
}
