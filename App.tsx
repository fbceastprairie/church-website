import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home.tsx';
import Give from './pages/Give.tsx';
import Contact from './pages/Contact.tsx';
import BlogList from './pages/blog/BlogList.tsx';
import BlogPost from './pages/blog/BlogPost.tsx';
import Login from './pages/blog/Login.tsx';
import AdminDashboard from './pages/blog/AdminDashboard.tsx';
import Editor from './pages/blog/Editor.tsx';

const App: React.FC = () => {
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
