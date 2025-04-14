
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Activity, Users, PlusCircle, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

export const MobileNavigation = () => {
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  
  // Only show tabs on authenticated pages and not on login
  if (location.pathname === '/login') {
    return null;
  }
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around items-center h-16">
        <Link 
          to="/dashboard"
          className={cn(
            "flex flex-col items-center justify-center w-full h-full text-xs font-medium transition-colors",
            location.pathname === "/dashboard" 
              ? "text-blue-600" 
              : "text-gray-500 hover:text-blue-600"
          )}
        >
          <Home className="h-5 w-5 mb-1" />
          <span>Home</span>
        </Link>
        
        <Link 
          to="/transactions"
          className={cn(
            "flex flex-col items-center justify-center w-full h-full text-xs font-medium transition-colors",
            location.pathname === "/transactions" 
              ? "text-blue-600" 
              : "text-gray-500 hover:text-blue-600"
          )}
        >
          <Activity className="h-5 w-5 mb-1" />
          <span>Transactions</span>
        </Link>
        
        {currentUser?.isAdmin && (
          <Link 
            to="/dashboard?tab=members"
            className={cn(
              "flex flex-col items-center justify-center w-full h-full text-xs font-medium transition-colors",
              location.pathname === "/dashboard" && location.search === "?tab=members"
                ? "text-blue-600" 
                : "text-gray-500 hover:text-blue-600"
            )}
          >
            <Users className="h-5 w-5 mb-1" />
            <span>Players</span>
          </Link>
        )}
        
        {currentUser?.isAdmin && (
          <Link 
            to="/dashboard?showTransactionForm=true"
            className={cn(
              "flex flex-col items-center justify-center w-full h-full text-xs font-medium transition-colors",
              "text-gray-500 hover:text-blue-600"
            )}
          >
            <PlusCircle className="h-5 w-5 mb-1" />
            <span>Record</span>
          </Link>
        )}
      </div>
    </div>
  );
};
