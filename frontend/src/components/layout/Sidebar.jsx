import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  LayoutDashboard, 
  Briefcase, 
  BookOpen, 
  GitBranch, 
  CheckSquare, 
  LogOut, 
  X 
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', to: '/projects', icon: Briefcase },
    { name: 'Resources', to: '/resources', icon: BookOpen },
    { name: 'Decisions', to: '/decisions', icon: GitBranch },
    { name: 'Tasks', to: '/tasks', icon: CheckSquare },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 w-64">
      {/* Header / Logo */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <NavLink to="/dashboard" className="flex items-center gap-2.5 text-indigo-600">
          <div className="p-1.5 bg-indigo-50 rounded-lg">
            <Shield className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <span className="text-lg font-bold text-gray-900 tracking-tight">ContextVault</span>
            <span className="block text-[10px] text-gray-400 font-medium -mt-1">Project Context Hub</span>
          </div>
        </NavLink>
        <button
          className="lg:hidden text-gray-500 hover:text-gray-700"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-5 overflow-y-auto">
        <div className="px-4 mb-2">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Workspace
          </p>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Profile / Logout */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="truncate">
              <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || 'Arun'}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email || 'arun@example.com'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 text-gray-400 rounded-md hover:bg-gray-100 hover:text-red-600 transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setSidebarOpen(false)}
          ></div>
          <div className="fixed inset-y-0 left-0 z-50 flex w-64 shadow-xl">
            {sidebarContent}
          </div>
        </div>
      )}

      <div className="hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:z-30">
        {sidebarContent}
      </div>
    </>
  );
}
