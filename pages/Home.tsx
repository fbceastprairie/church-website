import React from 'react';
import Layout from '../components/Layout';
import { ASSETS, CHURCH_INFO } from '../constants';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative h-[700px] w-full flex items-center justify-center">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: `url(${ASSETS.STAINED_GLASS_MAIN})` }}
        >
          <div className="absolute inset-0 bg-black/60 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-church-primary/90 to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {/* Logo: Adjusted to handle any aspect ratio better */}
          <img 
            src={ASSETS.STREAMING_LOGO} 
            alt="Church Logo" 
            className="h-24 w-auto mx-auto mb-6 opacity-90 drop-shadow-2xl" 
          />
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4 drop-shadow-lg">
            Welcome Home
          </h1>
          <p className="text-xl md:text-2xl text-gray-100 mb-8 font-light max-w-2xl mx-auto">
            "We are known locally for our stained glass, but we are defined by our love for Jesus."
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/contact" 
              className="px-8 py-3 bg-white text-church-primary font-bold rounded-full hover:bg-gray-100 transition shadow-lg"
            >
              Plan Your Visit
            </Link>
            <a 
              href={CHURCH_INFO.facebookUrl} 
              target="_blank" 
              rel="noreferrer"
              className="px-8 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition shadow-lg flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Watch on Facebook
            </a>
          </div>
        </div>
      </div>

      {/* Live Stream Links Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif font-bold text-church-primary mb-12">Join Our Worship Online</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Facebook Card */}
            <a href={CHURCH_INFO.facebookUrl} target="_blank" rel="noreferrer" className="group block">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-8 hover:shadow-xl transition transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Facebook Live</h3>
                <p className="text-gray-600">Catch our service live-streamed every Sunday morning at 10:30 AM.</p>
              </div>
            </a>

            {/* YouTube Card */}
            <a href={CHURCH_INFO.youtubeUrl} target="_blank" rel="noreferrer" className="group block">
              <div className="bg-red-50 border border-red-100 rounded-xl p-8 hover:shadow-xl transition transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.498-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">YouTube Live</h3>
                <p className="text-gray-600">Watch high-quality streams and browse our archive of past sermons.</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* About/Image Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 rounded-lg overflow-hidden shadow-2xl">
              <img src={ASSETS.BUILDING_EXTERIOR} alt="Church Building" className="absolute inset-0 w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-3xl font-serif font-bold text-church-primary mb-6">A Place to Belong</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                At First Baptist East Prairie, we believe in the power of community and the transformative love of God. 
                Whether you have grown up in church or are just starting to ask questions about faith, there is a place for you here.
              </p>
              <p className="text-gray-700 leading-relaxed mb-8">
                Located in the heart of East Prairie, MO, we are dedicated to serving our neighbors and sharing the good news.
              </p>
              <Link to="/blog" className="text-church-secondary font-bold hover:text-church-primary transition flex items-center">
                Read our latest news <span className="ml-2">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
