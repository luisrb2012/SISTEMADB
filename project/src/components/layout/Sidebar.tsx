import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  X, 
  Home, 
  Users, 
  ClipboardList, 
  Search, 
  Settings,
  FileText,
  Stethoscope
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  closeSidebar?: () => void;
}

/**
 * Navigation item component
 */
const NavItem: React.FC<NavItemProps> = ({ to, icon, label, closeSidebar }) => {
  return (
    <NavLink
      to={to}
      onClick={closeSidebar}
      className={({ isActive }) => 
        `flex items-center rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
          isActive
            ? 'bg-primary-50 text-primary-700'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`
      }
    >
      <span className="mr-3">{icon}</span>
      {label}
    </NavLink>
  );
};

/**
 * Sidebar navigation component
 */
const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar }) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity md:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform overflow-y-auto bg-white p-4 transition duration-300 ease-in-out md:relative md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-xl font-bold text-primary-700">RadAnam</h2>
          <button
            onClick={closeSidebar}
            className="rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 md:hidden"
            aria-label="Fechar menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-1">
          <NavItem
            to="/dashboard"
            icon={<Home size={20} />}
            label="Dashboard"
            closeSidebar={closeSidebar}
          />
          <NavItem
            to="/patients/new"
            icon={<Users size={20} />}
            label="Cadastrar Paciente"
            closeSidebar={closeSidebar}
          />
          <NavItem
            to="/anamnesis-history"
            icon={<ClipboardList size={20} />}
            label="Anamneses"
            closeSidebar={closeSidebar}
          />
          <NavItem
            to="/search"
            icon={<Search size={20} />}
            label="Buscar Paciente"
            closeSidebar={closeSidebar}
          />
        </nav>

        <div className="mt-10 border-t border-gray-200 pt-6">
          <h3 className="mb-2 px-4 text-xs font-semibold uppercase text-gray-500">
            Recursos
          </h3>
          <nav className="space-y-1">
            <NavItem
              to="/forms"
              icon={<FileText size={20} />}
              label="Modelos de Formulário"
              closeSidebar={closeSidebar}
            />
            <NavItem
              to="/medical"
              icon={<Stethoscope size={20} />}
              label="Recursos Médicos"
              closeSidebar={closeSidebar}
            />
            <NavItem
              to="/settings"
              icon={<Settings size={20} />}
              label="Configurações"
              closeSidebar={closeSidebar}
            />
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;