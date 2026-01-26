import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

console.log("FBC Website: Entry point initialized.");

const container = document.getElementById('root');
const loadingScreen = document.getElementById('loading-screen');

if (container) {
  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    // Hide loading screen
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (loadingScreen) {
          loadingScreen.style.opacity = '0';
          setTimeout(() => loadingScreen.remove(), 500);
        }
        console.log("FBC Website: Application mounted.");
      }, 300);
    });

  } catch (error) {
    console.error("FBC Website: Startup Error:", error);
    
    if (loadingScreen) loadingScreen.remove();
    
    container.innerHTML = `
      <div style="padding: 60px 20px; font-family: sans-serif; color: #1e293b; text-align: center; max-width: 600px; margin: 0 auto; line-height: 1.5;">
        <h2 style="color: #1e3a8a; font-size: 24px; margin-bottom: 16px;">Application Error</h2>
        <p style="color: #64748b; margin-bottom: 24px;">The website could not start. This usually means a file failed to load or there's a connection issue.</p>
        
        <div style="text-align: left; background: #fff1f2; padding: 20px; border-radius: 8px; border: 1px solid #fecaca; font-family: monospace; font-size: 13px; color: #991b1b; overflow-x: auto;">
          <strong>Error Trace:</strong><br/>
          ${error instanceof Error ? error.stack || error.message : String(error)}
        </div>
        
        <button onclick="window.location.reload()" style="margin-top: 32px; background: #1e3a8a; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-weight: bold;">
          Try Again
        </button>
      </div>
    `;
  }
}