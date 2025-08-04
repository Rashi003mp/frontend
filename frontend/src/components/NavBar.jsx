import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand Logo */}
          <div className="flex-shrink-0 flex items-center">
            <span className="text-xl font-light tracking-widest">JENSO|GRAM</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:ml-6 md:flex md:space-x-8">
            <NavLink 
              to="/"
              className={({ isActive }) => 
                `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive 
                    ? 'border-red-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink 
              to="/products"
              className={({ isActive }) => 
                `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive 
                    ? 'border-red-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`
              }
            >
              Products
            </NavLink>
            <NavLink 
              to="/collections"
              className={({ isActive }) => 
                `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive 
                    ? 'border-red-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`
              }
            >
              Collections
            </NavLink>
            <NavLink 
              to="/about"
              className={({ isActive }) => 
                `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive 
                    ? 'border-red-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`
              }
            >
              About
            </NavLink>
          </div>

          {/* Callus - Right side */}
          <div className="flex items-center">
            <span className="text-xs font-light tracking-widest">Callus ©</span>
          </div>
        </div>
      </div>

      {/* Mobile menu (optional) */}
      <div className="md:hidden">
        <div className="pt-2 pb-3 space-y-1">
          <NavLink 
            to="/"
            className={({ isActive }) => 
              `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive 
                  ? 'border-red-500 bg-red-50 text-red-700' 
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`
            }
          >
            Home
          </NavLink>
          {/* Add other mobile links similarly */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;