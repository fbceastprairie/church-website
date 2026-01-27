import React from 'react';
import Layout from '../components/Layout.tsx';
import { CHURCH_INFO, SERVICE_TIMES } from '../constants.ts';

const Contact: React.FC = () => {
  return (
    <Layout>
      <div className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-serif font-bold text-church-primary mb-4">Connect With Us</h1>
            <p className="text-lg text-gray-600">We'd love to see you this Sunday!</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            
            {/* Info Card */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">Service Times</h2>
              <ul className="space-y-4 mb-8">
                {SERVICE_TIMES.map((st, idx) => (
                  <li key={idx} className="flex justify-between items-center">
                    <span className="font-medium text-gray-600">{st.day} - {st.label}</span>
                    <span className="font-bold text-church-primary">{st.time}</span>
                  </li>
                ))}
              </ul>

              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">Contact Info</h2>
              <div className="space-y-4 text-gray-600">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-church-accent mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <div>
                    <p className="font-bold text-gray-900">Address</p>
                    <p><a href="https://www.google.com/maps/dir//First+Baptist+Church,+205+Pearl+St,+East+Prairie,+MO+63845/@36.7836993,-89.3891031,15z/data=!4m8!4m7!1m0!1m5!1m1!1s0x8879b2a89903d7ab:0x7f8f3ed16f9fbe6e!2m2!1d-89.3892226!2d36.7836993?entry=ttu&g_ep=EgoyMDI2MDEyMS4wIKXMDSoKLDEwMDc5MjA2OUgBUAM%3D" target="_blank">{CHURCH_INFO.address}</a></p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-church-accent mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  <div>
                    <p className="font-bold text-gray-900">Phone</p>
                    <p><a href={`tel:${CHURCH_INFO.phone}`} className="hover:text-blue-600">{CHURCH_INFO.phone}</a></p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden h-full min-h-[400px]">
              <iframe 
                title="Google Maps Location"
                className="w-full h-full border-0"
                src="https://maps.google.com/maps?width=100%25&height=600&hl=en&q=First%20Baptist%20Church%20205%20Pearl%20St%20East%20Prairie%20MO%2063845&t=&z=15&ie=UTF8&iwloc=B&output=embed"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
