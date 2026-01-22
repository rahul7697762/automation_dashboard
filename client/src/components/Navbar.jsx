import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Agents', path: '/agents' },
        { name: 'Broadcast', path: '/broadcast' },
        { name: 'Dashboard', path: '/dashboard' },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${scrolled
                ? 'bg-white/80 backdrop-blur-md shadow-lg py-3'
                : 'bg-transparent py-5'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                {/* Logo */}
                <Link
                    to="/"
                    className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-80 transition-opacity"
                >
                    Bitlance<span className="text-gray-800">.ai</span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`text-sm font-medium transition-colors duration-200 ${location.pathname === link.path
                                ? 'text-blue-600'
                                : 'text-gray-600 hover:text-blue-600'
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* CTA Button */}
                <div className="hidden md:block">
                    <Link to="/agents">
                        <button className="px-5 py-2.5 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                            Launch App
                        </button>
                    </Link>
                </div>

                {/* Mobile Menu Button (Hamburger) - Simplified for brevity, can be expanded */}
                <div className="md:hidden">
                    <button className="text-gray-700 focus:outline-none">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
