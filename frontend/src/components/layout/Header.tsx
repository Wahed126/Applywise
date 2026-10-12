import NavItem from './NavItem';
export default function Header() {
  return (
    <header className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <h1 className="text-lg font-semibold text-gray-900">ApplyWise</h1>
        <NavItem />
      </div>
    </header>
  );
}