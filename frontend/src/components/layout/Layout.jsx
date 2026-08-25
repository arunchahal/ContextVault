import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = (pathname) => {
    if (pathname === '/dashboard') return 'Project Dashboard';
    if (pathname === '/projects') return 'Projects';
    if (pathname === '/projects/new') return 'New Project';
    if (pathname.match(/^\/projects\/[^/]+\/edit$/)) return 'Edit Project';
    if (pathname.match(/^\/projects\/[^/]+$/)) return 'Project Context Hub';
    if (pathname === '/resources') return 'Resources & Documentation';
    if (pathname === '/decisions') return 'Technical Decisions';
    if (pathname === '/tasks') return 'Project Tasks';
    return 'ContextVault';
  };

  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="lg:pl-64 flex-1 flex flex-col min-h-screen">
        <TopBar title={pageTitle} setSidebarOpen={setSidebarOpen} />
        <main className="p-4 lg:p-6 flex-1 w-full max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
