import React from 'react';
import { Link } from 'react-router-dom';
import { CHURCH_INFO, SERVICE_TIMES } from '../constants.ts';

const Footer: React.FC = () => {
  return (
    <footer className="bg-church-dark text-gray-300 border-t-4 border-church-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: About & Contact */}
          <div>
            <h3 className="text-white text-lg font-serif font-bold mb-4">First Baptist East Prairie</h3>
            <p className="mb-6 text-sm leading-relaxed text-gray-400">
              Serving our community with the love of Christ. <br />
              Come worship with us!
            </p>
            
            <div className="space-y-3">
                <div className="flex items-start">
                    <svg className="h-5 w-5 text-church-accent mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm text-gray-400 hover:text-white transition-colors">
                      <Link to="/contact">{CHURCH_INFO.address}</Link>
                    </span>
                </div>
                <div className="flex items-center">
                    <svg className="h-5 w-5 text-church-accent mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a href={`tel:${CHURCH_INFO.phone}`} className="text-sm text-gray-400 hover:text-white transition-colors">
                        {CHURCH_INFO.phone}
                    </a>
                </div>
            </div>
          </div>

          {/* Middle Column: Quick Links */}
          <div>
            <h3 className="text-white text-lg font-serif font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/give" className="hover:text-church-accent transition">Give Online</Link></li>
              <li><Link to="/contact" className="hover:text-church-accent transition">Service Times & Directions</Link></li>
              <li><Link to="/blog" className="hover:text-church-accent transition">News & Updates</Link></li>
              <li>
                <a href={CHURCH_INFO.facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-church-accent transition">
                    Facebook Page
                </a>
              </li>
              <li>
                <a href={CHURCH_INFO.youtubeUrl} target="_blank" rel="noopener noreferrer" className="hover:text-church-accent transition">
                    YouTube Channel
                </a>
              </li>
            </ul>
          </div>

          {/* Right Column: Service Times */}
          <div>
            <h3 className="text-white text-lg font-serif font-bold mb-4">Service Times</h3>
            <ul className="space-y-2 text-sm">
              {SERVICE_TIMES.map((st, idx) => (
                <li key={idx} className="flex items-center border-b border-gray-800 pb-2">
                  {/* Left: Day (flex-1 ensures it pushes against the right side equally) */}
                  <div className="flex-1 text-left">
                    <span className="text-gray-400">{st.day}</span>
                  </div>
                  
                  {/* Center: Description with separators */}
                  <div className="px-2">
                    <span className="text-gray-500 tracking-wide flex items-center gap-2 whitespace-nowrap">
                        <span className="text-[12px]">♦</span>
                        {st.label}
                        <span className="text-[12px]">♦</span>
                    </span>
                  </div>

                  {/* Right: Time */}
                  <div className="flex-1 text-right">
                    <span className="font-semibold text-white">{st.time}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} First Baptist Church East Prairie. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
