import React from 'react';
import { Outlet } from 'react-router-dom';
import { NavbarDefault } from './Navbar';

const Layout = () => {
  return (
    <div>
      <NavbarDefault />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
