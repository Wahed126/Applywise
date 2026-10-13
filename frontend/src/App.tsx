import useNavigation from './hooks/useNavigation';
import AppLayout from './layouts/AppLayout';
import { navigationItems } from './lib/navigation';
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';

export default function App() {
  const { currentPage, onNavigate } = useNavigation();
  const currentItem = navigationItems.find((item) => item.page === currentPage);

  return (
    <AppLayout currentPage={currentPage} onNavigate={onNavigate}>
      {currentPage === 'dashboard' ? (
        <Dashboard />
      ) : currentPage === 'jobs' ? (
        <Jobs />
      ) : (
        <section className="p-4 text-center">
          <h1 className="text-xl font-semibold">{currentItem?.label ?? 'Page not found'}</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            {currentItem ? 'This page is coming soon.' : 'Choose a page from the navigation to continue.'}
          </p>
        </section>
      )}
    </AppLayout>
  );
}
