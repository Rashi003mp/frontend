import React from "react";
import { Link } from "react-router-dom"; // ✅ Use Link instead of <a>
import {
  ChartBarIcon,
  ShoppingCartIcon,
  RectangleStackIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon
} from '@heroicons/react/24/outline';

const AdminSidebar = ({
  user,
  todayOrdersCount,
  isSidebarCollapsed,
  toggleSidebar,
  isMobileOpen,
  setIsMobileOpen
}) => {
  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden transition-opacity duration-300 ${
          isMobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setIsMobileOpen(false)}
      />

      <div
        className={`
          ${isSidebarCollapsed ? 'w-20' : 'w-64'}
          bg-[#1A1A1A] text-white transition-all duration-300
          flex-shrink-0 h-screen sticky top-0 overflow-y-auto
          z-40 flex flex-col
          ${isMobileOpen ? 'fixed left-0 top-0 h-full' : 'hidden md:flex'}
        `}
      >
        {/* Logo & admin info */}
        <div className="p-4 border-b border-[#333333]">
          <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'space-x-3'}`}>
            <div className="w-10 h-10 bg-[#CC9966] rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-medium text-sm">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </span>
            </div>
            {!isSidebarCollapsed && (
              <div className="min-w-0">
                <h1 className="font-semibold text-[#CC9966] text-sm truncate">
                  {user?.name || 'Admin'}
                </h1>
                <p className="text-xs text-gray-400 truncate">
                  {user?.email || ''}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Nav links */}
        <nav className="mt-6 flex-1">
          <div className="space-y-1 px-2">
            {/* Dashboard */}
            <Link
              to="/admindashboard"
              className={`flex items-center ${isSidebarCollapsed ? 'justify-center py-3 mx-2' : 'px-4 py-3'} text-[#CC9966] bg-[#333333] border-l-4 border-[#CC9966] rounded-md`}
            >
              <ChartBarIcon className="w-5 h-5 flex-shrink-0" />
              {!isSidebarCollapsed && (
                <span className="ml-3 text-sm tracking-wider">Dashboard</span>
              )}
            </Link>

            {/* Collections */}
            <Link
              to="/admincollection"
              className={`flex items-center ${isSidebarCollapsed ? 'justify-center py-3 mx-2' : 'px-4 py-3'} text-gray-300 hover:bg-[#333333] hover:text-[#CC9966] rounded-md transition-colors duration-200`}
            >
              <RectangleStackIcon className="w-5 h-5 flex-shrink-0" />
              {!isSidebarCollapsed && (
                <span className="ml-3 text-sm tracking-wider">Collections</span>
              )}
            </Link>

            {/* Orders */}
            <Link
              to="/adminorders"
              className={`relative flex items-center ${isSidebarCollapsed ? 'justify-center py-3 mx-2' : 'px-4 py-3'} text-gray-300 hover:bg-[#333333] hover:text-[#CC9966] rounded-md transition-colors duration-200`}
            >
              <ShoppingCartIcon className="w-5 h-5 flex-shrink-0" />
              {!isSidebarCollapsed && (
                <div className="flex items-center justify-between w-full ml-3">
                  <span className="text-sm tracking-wider">Orders</span>
                  {todayOrdersCount > 0 && (
                    <span className="bg-[#CC9966] text-white text-xs px-2 py-0.5 rounded-full">
                      {todayOrdersCount}
                    </span>
                  )}
                </div>
              )}
              {isSidebarCollapsed && todayOrdersCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-[#CC9966] rounded-full" />
              )}
            </Link>

            {/* Clients */}
            <Link
              to='/adminclient'
              className={`flex items-center ${isSidebarCollapsed ? 'justify-center py-3 mx-2' : 'px-4 py-3'} text-gray-300 hover:bg-[#333333] hover:text-[#CC9966] rounded-md transition-colors duration-200`}
            >
              <UserGroupIcon className="w-5 h-5 flex-shrink-0" />
              {!isSidebarCollapsed && (
                <span className="ml-3 text-sm tracking-wider">Clients</span>
              )}
            </Link>
          </div>

          {/* Management section */}
          {!isSidebarCollapsed && (
            <div className="mt-8">
              <div className="px-4 mb-2">
                <p className="text-xs text-gray-500 uppercase tracking-wider">Management</p>
              </div>
              <div className="space-y-1 px-2">
                <Link
                  to="/admin/analytics"
                  className="flex items-center px-4 py-3 text-gray-300 hover:bg-[#333333] hover:text-[#CC9966] rounded-md transition-colors duration-200"
                >
                  <ChartBarIcon className="w-5 h-5 flex-shrink-0" />
                  <span className="ml-3 text-sm tracking-wider">Analytics</span>
                </Link>
                <Link
                  to="/admin/settings"
                  className="flex items-center px-4 py-3 text-gray-300 hover:bg-[#333333] hover:text-[#CC9966] rounded-md transition-colors duration-200"
                >
                  <Cog6ToothIcon className="w-5 h-5 flex-shrink-0" />
                  <span className="ml-3 text-sm tracking-wider">Settings</span>
                </Link>
              </div>
            </div>
          )}
        </nav>

        {/* Collapse toggle moved to bottom */}
        <div className="p-4 border-t border-[#333333] mt-auto flex justify-center">
          <button
            onClick={toggleSidebar}
            className="bg-[#CC9966] text-white p-1 rounded-full shadow-md hover:bg-[#B38658] transition-colors duration-200"
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isSidebarCollapsed ? (
              <ChevronDoubleRightIcon className="w-4 h-4" />
            ) : (
              <ChevronDoubleLeftIcon className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
