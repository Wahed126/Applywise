import { Search } from 'lucide-react';

type SearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
};

export default function SearchField({ value, onChange, autoFocus = false }: SearchFieldProps) {
  return (
    <label className="flex h-9 w-full items-center gap-2 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-2.5 text-[#475569] transition-shadow focus-within:border-blue-400 focus-within:ring-3 focus-within:ring-blue-100 dark:border-[#3b4650] dark:bg-[#1b242c] dark:text-slate-300 dark:focus-within:ring-blue-500/20">
      <Search className="size-4 shrink-0" strokeWidth={1.8} aria-hidden="true" />
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
