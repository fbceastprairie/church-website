import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Give from './pages/Give';
import Contact from './pages/Contact';
import BlogList from './pages/blog/BlogList';
import BlogPost from './pages/blog/BlogPost';
import Login from './pages/blog/Login';
import AdminDashboard from './pages/blog/AdminDashboard';
import Editor from './pages/blog/Editor';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/give" element={<Give />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Blog Public Routes */}
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/post/:id" element={<BlogPost />} />
        <Route path="/blog/login" element={<Login />} />
        
        {/* Protected/Admin Routes */}
        <Route path="/blog/admin" element={<AdminDashboard />} />
        <Route path="/blog/editor" element={<Editor />} />
        <Route path="/blog/editor/:id" element={<Editor />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
