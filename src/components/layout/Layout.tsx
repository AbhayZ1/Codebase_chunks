import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { useAppContext } from '../../context/AppContext';

const Layout: React.FC = () => {
  const { darkMode } = useAppContext();

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;