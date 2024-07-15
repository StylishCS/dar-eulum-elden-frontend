import React from 'react';
import { Outlet } from 'react-router-dom';
import { DashboardSidebar } from './DashboardSidebar';

const DashboardLayout = () => {
  return (
    <div className="flex h-screen">
      <div className="fixed h-screen w-64">
        <DashboardSidebar />
      </div>
      <main className="ml-64 flex-grow p-4 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
