import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ASSETS, CHURCH_INFO } from '../constants';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-church-accent font-bold' : 'text-gray-200 hover:text-white';
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Connect & Visit', path: '/contact' },
    { name: 'Give', path: '/give' },
    { name: 'News & Blog', path: '/blog' },
  ];

  return (
    <nav className="bg-church-primary shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-3">
               <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden border-2 border-church-accent">
                 <img className="h-8 w-auto" src={ASSETS.STREAMING_LOGO} alt="Dove Logo" />
               </div>
               <div className="flex flex-col">
                  <span className="font-serif font-bold text-white text-lg tracking-wide leading-tight">First Baptist Church</span>
                  <span className="text-church-accent text-xs uppercase tracking-wider font-semibold">East Prairie, MO</span>
               </div>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`${isActive(link.path)} transition-colors duration-200 text-sm uppercase tracking-wide`}
              >
                {link.name}
              </Link>
            ))}
            <a 
              href={CHURCH_INFO.facebookUrl} 
              target="_blank" 
              rel="noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-white focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-church-primary border-t border-blue-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive(link.path)}`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;