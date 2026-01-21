import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { logOut } from '../lib/firebase';

const Navbar: React.FC = () => {
    const location = useLocation();
    const { user, loading } = useAuth();

    const navLinks = [
        { label: 'Home', href: '/' },
        { label: 'Characters', href: '/characters' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Contact', href: '/contact' },
    ];

    if (loading) return null;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-gray-200 no-print">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 group cursor-pointer">
                    <div className="bg-slate-900 text-white p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg">
                        <MapPin className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-light text-slate-900 tracking-tight">Young Explorers</span>
                </Link>

                <div className="flex items-center gap-8">
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                to={link.href}
                                className={`text-sm font-medium uppercase tracking-widest transition-colors ${location.pathname === link.href
                                    ? 'text-indigo-600'
                                    : 'text-slate-500 hover:text-slate-900'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-slate-700 hidden sm:block">
                                    Hey, {user.displayName?.split(' ')[0] || 'Explorer'}
                                </span>
                                <button
                                    onClick={() => logOut()}
                                    className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                                >
                                    Log Out
                                </button>
                                <Link
                                    to="/create"
                                    className="hidden sm:block px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5"
                                >
                                    Create Board
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link
                                    to="/login"
                                    className="text-sm font-medium text-slate-600 hover:text-slate-900"
                                >
                                    Log In
                                </Link>
                                <Link
                                    to="/signup"
                                    className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-medium hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all hover:-translate-y-0.5"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
