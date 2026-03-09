import React from 'react';
import Layout from '../components/Layout.tsx';

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
          
          <div className="mb-8 w-full">
            <div style={{ position: 'relative', overflow: 'hidden', height: '800px', width: '100%' }}>
              <iframe 
                title='Donation form powered by Zeffy' 
                style={{ position: 'absolute', border: 0, top: 0, left: 0, bottom: 0, right: 0, width: '100%', height: '100%' }} 
                src='https://www.zeffy.com/embed/donation-form/general-fund-86' 
                allow="payment" 
              ></iframe>
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
