import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, Sun, Moon, Menu } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const Navbar: React.FC = () => {
  const { darkMode, toggleDarkMode, toggleFileExplorer } = useAppContext();
  
  return (
    <nav className={`${darkMode ? 'bg-gray-800' : 'bg-white'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} px-4 py-3 sticky top-0 z-10`}>
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <button onClick={toggleFileExplorer} className="md:hidden p-2 rounded-md hover:bg-gray-700">
            <Menu size={20} />
          </button>
          <Link to="/" className="flex items-center space-x-2">
            <Code2 className="text-primary-500" size={24} />
            <span className="text-xl font-bold">CodeInsight</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link 
            to="/dashboard" 
            className="text-sm font-medium hover:text-primary-400 transition-colors"
          >
            Dashboard
          </Link>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} transition-colors`}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;