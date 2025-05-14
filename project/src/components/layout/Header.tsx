import React from 'react';
import { Menu, Bell, User } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

interface HeaderProps {
  openSidebar: () => void;
}

/**
 * Application header component
 * Contains mobile menu toggle, notifications, and user menu
 */
const Header: React.FC<HeaderProps> = ({ openSidebar }) => {
  const { user, logout } = useAuthStore();
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between bg-white px-4 py-3 shadow-sm md:px-6">
      {/* Mobile menu button */}
      <button
        onClick={openSidebar}
        className="rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 md:hidden"
        aria-label="Abrir menu"
      >
        <Menu size={24} />
      </button>

      <div className="flex items-center">
        <h1 className="hidden text-xl font-semibold text-primary-700 md:block">
          RadAnam
        </h1>
      </div>

      {/* Right side icons */}
      <div className="flex items-center space-x-3">
        {/* Notifications */}
        <button
          className="rounded-full p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
          aria-label="Notificações"
        >
          <Bell size={20} />
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center rounded-full p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Menu do usuário"
          >
            <span className="sr-only">Abrir menu do usuário</span>
            <User size={20} />
          </button>

          {/* User dropdown menu */}
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="border-b border-gray-100 px-4 py-2">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;