import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ASSETS, CHURCH_INFO } from '../constants.ts';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  const getLinkClasses = (path: string, isMobile = false) => {
    const isActive = location.pathname === path;
    
    if (isMobile) {
        return isActive 
            ? 'text-church-accent font-bold' 
            : 'text-gray-200 hover:text-white hover:font-bold';
    }

    return isActive 
        ? 'text-church-accent font-bold' 
        : 'text-gray-200 hover:text-white hover:font-bold font-normal';
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
               <div className="flex items-center justify-center">
                 <img className="h-10 w-auto object-contain" src={ASSETS.STREAMING_LOGO} alt="Church Logo" />
               </div>
               <div className="flex flex-col">
                  <span className="font-serif font-bold text-white text-lg tracking-wide leading-tight">First Baptist Church</span>
                  <span className="text-church-accent text-xs uppercase tracking-wider font-semibold">East Prairie, MO</span>
               </div>
            </Link>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="relative text-sm uppercase tracking-wide group"
              >
                <span className="invisible font-bold" aria-hidden="true">{link.name}</span>
                <span 
                    className={`absolute inset-0 flex items-center justify-center transition-colors duration-200 ${getLinkClasses(link.path)}`}
                >
                    {link.name}
                </span>
              </Link>
            ))}
            
            {/* Social Icons Desktop */}
            <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-blue-800">
                <a href={CHURCH_INFO.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                    <span className="sr-only">Facebook</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                </a>
                <a href={CHURCH_INFO.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                    <span className="sr-only">YouTube</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.254.418-4.814a2.506 2.506 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418zM15.194 12 10 15V9l5.194 3z" clipRule="evenodd" />
                    </svg>
                </a>
            </div>
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-white focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-church-primary border-t border-blue-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${getLinkClasses(link.path, true)}`}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Mobile Social Links */}
            <div className="flex space-x-6 px-3 py-4 border-t border-blue-800 mt-2">
                <a href={CHURCH_INFO.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white flex items-center gap-2">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                    <span>Facebook</span>
                </a>
                <a href={CHURCH_INFO.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white flex items-center gap-2">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.254.418-4.814a2.506 2.506 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418zM15.194 12 10 15V9l5.194 3z" clipRule="evenodd" />
                    </svg>
                    <span>YouTube</span>
                </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;