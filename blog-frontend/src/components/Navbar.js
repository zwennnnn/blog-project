import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const excludedRoutes = ['/panel', '/editor'];

    if (excludedRoutes.includes(location.pathname)) {
        return null;
    }

    return (
        <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo ve Site Adı */}
                    <Link to="/" className="flex items-center space-x-3">
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        <span className="text-2xl font-bold">Zwennnn Blog</span>
                    </Link>

                    {/* Mobil Menü Butonu */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-white hover:text-gray-200 focus:outline-none"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>

                    {/* Desktop Menü */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="hover:text-yellow-300 transition-colors duration-200">
                            Anasayfa
                        </Link>
                        <Link to="/about" className="hover:text-yellow-300 transition-colors duration-200">
                            Hakkımızda
                        </Link>
                        <Link to="/contact" className="hover:text-yellow-300 transition-colors duration-200">
                            İletişim
                        </Link>
                        <Link to="/login" className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-all duration-200 transform hover:scale-105">
                            Giriş Yap
                        </Link>
                    </div>
                </div>

                {/* Mobil Menü */}
                {isMenuOpen && (
                    <div className="md:hidden mt-4 space-y-4">
                        <Link to="/" className="block hover:text-yellow-300 transition-colors duration-200">
                            Anasayfa
                        </Link>
                        <Link to="/about" className="block hover:text-yellow-300 transition-colors duration-200">
                            Hakkımızda
                        </Link>
                        <Link to="/contact" className="block hover:text-yellow-300 transition-colors duration-200">
                            İletişim
                        </Link>
                        <Link to="/login" className="block bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-all duration-200 inline-block">
                            Giriş Yap
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar; 