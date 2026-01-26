import React from 'react';
import Layout from '../components/Layout.tsx';
import { ASSETS, CHURCH_INFO, SERVICE_TIMES } from '../constants.ts';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center text-white overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 scale-105"
          style={{ backgroundImage: `url(${ASSETS.STAINED_GLASS_MAIN})` }}
        >
          <div className="absolute inset-0 bg-church-dark/70 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-church-dark via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl">
          <img src={ASSETS.STREAMING_LOGO} alt="FBC Logo" className="h-24 w-auto mx-auto mb-8 drop-shadow-2xl" />
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tight">
            Welcome to First Baptist
          </h1>
          <p className="text-xl md:text-2xl font-light italic mb-10 text-church-gold">
            "Known locally by our stained glass, but defined by our love for Jesus."
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="bg-church-accent hover:bg-amber-700 text-white px-8 py-4 rounded-full font-bold transition-all transform hover:scale-105 shadow-xl">
              Plan Your Visit
            </Link>
            <a href={CHURCH_INFO.facebookUrl} target="_blank" rel="noreferrer" className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-full font-bold transition-all">
              Watch Live
            </a>
          </div>
        </div>
      </section>

      {/* Service Times Quick Bar - 4 Column Layout */}
      <div className="bg-church-accent py-6 shadow-2xl relative z-20 -mt-8 mx-4 md:mx-auto max-w-7xl rounded-xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 px-4 divide-y lg:divide-y-0 lg:divide-x divide-white/20">
            <div className="text-center pt-2 lg:pt-0">
                <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-1">Sunday School</h3>
                <p className="text-white text-lg font-serif">9:30 AM</p>
            </div>
            <div className="text-center pt-2 lg:pt-0">
                <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-1">Worship Service</h3>
                <p className="text-white text-lg font-serif">10:30 AM</p>
            </div>
            <div className="text-center pt-4 lg:pt-0">
                <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-1">Evening Service</h3>
                <p className="text-white text-lg font-serif">5:00 PM</p>
            </div>
            <div className="text-center pt-4 lg:pt-0">
                <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-1">Wednesday Bible Study</h3>
                <p className="text-white text-lg font-serif">6:00 PM</p>
            </div>
        </div>
      </div>

      {/* Join Our Worship Online Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-serif font-bold text-church-primary mb-12">Join Our Worship Online</h2>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {/* Facebook Card */}
                <a href={CHURCH_INFO.facebookUrl} target="_blank" rel="noreferrer" className="group block bg-blue-50 border border-blue-100 rounded-xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-[#1877F2] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                             <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Facebook Live</h3>
                        <p className="text-gray-600 mb-4">Catch our service live-streamed every Sunday morning at 10:30 AM.</p>
                        <span className="text-[#1877F2] font-bold text-sm uppercase tracking-wide group-hover:underline">Watch on Facebook &rarr;</span>
                    </div>
                </a>

                {/* YouTube Card */}
                <a href={CHURCH_INFO.youtubeUrl} target="_blank" rel="noreferrer" className="group block bg-red-50 border border-red-100 rounded-xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-[#FF0000] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                             <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">YouTube Live</h3>
                        <p className="text-gray-600 mb-4">Watch high-quality streams and browse our archive of past sermons.</p>
                        <span className="text-[#FF0000] font-bold text-sm uppercase tracking-wide group-hover:underline">Watch on YouTube &rarr;</span>
                    </div>
                </a>
            </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-church-accent font-bold tracking-widest uppercase text-sm">About Our Church</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-church-dark mt-4 mb-8">A Place to Belong</h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              For generations, First Baptist Church of East Prairie has been a cornerstone of faith in our community. We are a family of believers dedicated to the preaching of the Word and the fellowship of the saints.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Whether you're a lifelong resident or just passing through Mississippi County, we invite you to experience the warmth of our congregation and the truth of the Gospel.
            </p>
            <Link to="/contact" className="inline-flex items-center text-church-primary font-bold hover:gap-3 transition-all gap-2">
              Learn more about what to expect <span className="text-2xl">→</span>
            </Link>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-church-accent/10 rounded-2xl rotate-3"></div>
            <img 
              src={ASSETS.BUILDING_EXTERIOR} 
              alt="Church Building" 
              className="relative rounded-2xl shadow-2xl z-10 w-full object-cover aspect-[4/3]" 
            />
          </div>
        </div>
      </section>

      {/* Call to Action: Give */}
      <section className="py-20 bg-church-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-stained-glass opacity-40"></div>
        <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Support Our Mission</h2>
          <p className="text-xl text-gray-300 mb-10 font-light">
            Your generosity helps us continue our ministries in East Prairie and beyond.
          </p>
          <Link to="/give" className="inline-block bg-white text-church-dark px-10 py-4 rounded-full font-bold hover:bg-church-gold transition-colors">
            Give Online
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Home;