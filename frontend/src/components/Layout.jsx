import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/trips/new', label: 'New Trip' },
    { path: '/search', label: 'Search Cities' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 glass-dark transition-transform duration-300 lg:transition-none`}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Globe Trotter
            </h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-700 hover:text-gray-900 text-xl font-semibold"
              aria-label="Close menu"
            >
              ×
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`px-4 py-3 rounded-lg transition-all font-medium ${
                  location.pathname === item.path
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="border-t border-white border-opacity-20 pt-4">
            <div className="px-4 py-2 text-sm text-gray-300 mb-2">
              {user?.name}
            </div>
            <button
              onClick={logout}
              className="w-full px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all font-medium text-left"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 lg:ml-0">
        {/* Mobile header */}
        <header className="lg:hidden glass-dark p-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-700 text-2xl font-bold"
            aria-label="Open menu"
          >
            ☰
          </button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Globe Trotter
          </h1>
          <div className="w-8" />
        </header>

        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
};

export default Layout;


