import React, { useState } from 'react';
import { useAdminRevenue } from '../Context/AdminContext';
import { useAuth } from '../../../context/AuthContext';
import AdminSidebar from '../components/AdminSidebar';
import RecentOrders from '../components/RecentOrders';
import UsersOrdersByMonthChart from '../components/UsersOrdersByDayChart';
import RevenueByDayChart from '../components/RevenueByDayChart';
import { ArrowPathIcon, BellIcon, ChartBarIcon, ShoppingCartIcon, CubeIcon } from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { isAdmin, user } = useAuth();

  const {
    totalRevenue,
    todayRevenue,
    weekRevenue,
    monthRevenue,
    orderCount,
    loading,
    todayOrdersCount,
    reloadOrders,
    todayPiecesSold,
  } = useAdminRevenue();

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FAF9F6]">
        <h2 className="text-2xl font-light">Access Denied — Admin Only</h2>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#FAF9F6]">
      {/* Sidebar */}
      <AdminSidebar
        user={user}
        todayOrdersCount={todayOrdersCount}
        isSidebarCollapsed={isSidebarCollapsed}
        toggleSidebar={toggleSidebar}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-[#E5D9C5] sticky top-0 z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h2 className="text-xl font-light">ADMINISTRATOR DASHBOARD</h2>
              <p className="text-xs text-[#5A5A5A]">Welcome back, {user?.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={reloadOrders}
                className="flex items-center space-x-1 text-[#5A5A5A] hover:text-[#CC9966]"
              >
                <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden md:inline">Refresh</span>
              </button>
              <button className="p-2 text-gray-400 hover:text-[#CC9966] relative">
                <BellIcon className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-[#CC9966] rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Body */}
        <main className="p-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-[#F8F5F0] to-[#F1E9DC] rounded-lg p-6 mb-6 border border-[#E5D9C5]">
            <div className="flex justify-between">
              <div>
                <h1 className="text-2xl font-light mb-2">Welcome, {user?.name}</h1>
                <p className="text-[#5A5A5A]">Today's overview of your luxury maison.</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#5A5A5A]">TODAY</p>
                <p className="text-lg font-light">{currentDate}</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Revenue */}
            <div className="bg-white p-6 rounded border shadow-sm">
              <ChartBarIcon className="w-6 h-6 text-[#CC9966] mb-3" />
              <p className="text-2xl font-light">€{totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-[#5A5A5A]">Total Revenue</p>
            </div>
            {/* Today's Revenue */}
            <div className="bg-white p-6 rounded border shadow-sm">
              <ChartBarIcon className="w-6 h-6 text-[#CC9966] mb-3" />
              <p className="text-2xl font-light">€{todayRevenue.toLocaleString()}</p>
              <p className="text-xs text-[#5A5A5A]">Today's Revenue</p>
            </div>
            {/* Orders Today */}
            <div className="bg-white p-6 rounded border shadow-sm">
              <ShoppingCartIcon className="w-6 h-6 text-[#CC9966] mb-3" />
              <p className="text-2xl font-light">{todayOrdersCount}</p>
              <p className="text-xs text-[#5A5A5A]">Orders Today</p>
            </div>
            {/* Pieces Sold */}
            <div className="bg-white p-6 rounded border shadow-sm">
              <CubeIcon className="w-6 h-6 text-[#CC9966] mb-3" />
              <p className="text-2xl font-light">{todayPiecesSold}</p>
              <p className="text-xs text-[#5A5A5A]">Pieces Sold</p>
            </div>
          </div>

          {/* Charts + Orders */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <RevenueByDayChart />
              <RecentOrders />
            </div>
            <div>
              <UsersOrdersByMonthChart />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
