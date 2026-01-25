import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, User, LogOut } from 'lucide-react';
import clsx from 'clsx';

const CadetLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-100">
             {/* Sidebar - simplified for Cadet */}
             <div className="w-64 bg-green-900 text-white flex flex-col">
                <div className="p-6 text-xl font-bold border-b border-green-800">ROTC Cadet</div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link
                        to="/cadet/dashboard"
                        className={clsx(
                            "flex items-center space-x-3 p-3 rounded transition",
                            location.pathname === '/cadet/dashboard' ? "bg-green-700 text-white" : "text-green-200 hover:bg-green-800 hover:text-white"
                        )}
                    >
                        <LayoutDashboard size={20} />
                        <span>My Portal</span>
                    </Link>
                    <Link
                        to="/cadet/profile"
                        className={clsx(
                            "flex items-center space-x-3 p-3 rounded transition",
                            location.pathname === '/cadet/profile' ? "bg-green-700 text-white" : "text-green-200 hover:bg-green-800 hover:text-white"
                        )}
                    >
                        <User size={20} />
                        <span>My Profile</span>
                    </Link>
                </nav>
                <div className="p-4 border-t border-green-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 p-3 w-full text-left text-green-200 hover:text-white hover:bg-green-800 rounded transition"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-6">
                <Outlet />
            </div>
        </div>
    );
};

export default CadetLayout;
