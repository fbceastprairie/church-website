import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home.tsx';
import Give from './pages/Give.tsx';
import Contact from './pages/Contact.tsx';
import BlogList from './pages/blog/BlogList.tsx';
import BlogPost from './pages/blog/BlogPost.tsx';
import Login from './pages/blog/Login.tsx';
import AdminDashboard from './pages/blog/AdminDashboard.tsx';
import Editor from './pages/blog/Editor.tsx';
import { runKeepAlive } from './services/db.ts';

const App: React.FC = () => {
  
  // Logic to keep Supabase DB alive by writing/deleting data on Mon/Thu
  useEffect(() => {
    const checkAndRunHeartbeat = async () => {
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0=Sun, 1=Mon, ..., 4=Thu
        
        // Only run on Monday (1) or Thursday (4)
        if (dayOfWeek === 1 || dayOfWeek === 4) {
            const lastRunDate = localStorage.getItem('fbc_last_heartbeat');
            const currentDateStr = today.toDateString();

            // If we haven't run it today yet
            if (lastRunDate !== currentDateStr) {
                console.log("Initiating scheduled database heartbeat...");
                await runKeepAlive();
                localStorage.setItem('fbc_last_heartbeat', currentDateStr);
            }
        }
    };

    // Run check on app mount
    checkAndRunHeartbeat();
  }, []);

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/give" element={<Give />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<BlogList />} />
        {/* Changed :id to :slug to support title-based URLs */}
        <Route path="/blog/post/:slug" element={<BlogPost />} />
        <Route path="/blog/login" element={<Login />} />
        <Route path="/blog/admin" element={<AdminDashboard />} />
        <Route path="/blog/editor" element={<Editor />} />
        <Route path="/blog/editor/:id" element={<Editor />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
