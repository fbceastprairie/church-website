import React from 'react';
import Layout from '../components/Layout';

const Give: React.FC = () => {
  return (
    <Layout>
      <div className="bg-church-primary py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Giving</h1>
        <p className="text-blue-100 max-w-2xl mx-auto px-4">
          "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver." — 2 Corinthians 9:7
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Online Tithes & Offerings</h2>
          
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 mb-8">
            <p className="text-gray-500 mb-4 font-semibold">Secure Giving Widget Area</p>
            <p className="text-sm text-gray-400">
              (Administrator: Paste your payment processor's embed code here in the source code of <code>pages/Give.tsx</code>)
            </p>
            {/* 
              PASTE EMBED CODE BELOW THIS LINE 
              Example: <iframe src="..." ...></iframe> 
            */}
            
            <div className="mt-8">
                <button className="bg-church-accent text-white px-6 py-3 rounded font-bold shadow hover:bg-yellow-600 transition">
                    Donate Now (Demo Button)
                </button>
            </div>
          </div>

          <div className="text-left text-gray-600 space-y-4">
            <h3 className="font-bold text-gray-800">Other Ways to Give</h3>
            <p>
              <strong>In Person:</strong> You can place your tithe in the offering plates during any of our services.
            </p>
            <p>
              <strong>By Mail:</strong><br />
              First Baptist Church<br />
              205 Pearl St<br />
              East Prairie, MO 63845
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Give;