import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import { getCurrentUser, logout } from '../../services/auth';
import { getPosts, deletePost } from '../../services/db';
import { BlogPost, User, UserRole } from '../../types';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const init = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        navigate('/blog/login');
        return;
      }
      setUser(currentUser);
      refreshPosts();
    };
    init();
  }, [navigate]);

  const refreshPosts = async () => {
    const data = await getPosts();
    setPosts(data);
    setLoading(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/blog/login');
  };

  const handleDelete = async (postId: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await deletePost(postId);
      refreshPosts();
    }
  };

  if (!user) return null;

  return (
    <Layout>
      <div className="bg-gray-100 min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="md:flex md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome, {user.username} ({user.role})</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Link
                to="/blog/editor"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-church-primary hover:bg-blue-900"
              >
                + New Article
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Admin Notice */}
          {user.role === UserRole.ADMIN && (
             <div className="mb-8 p-4 bg-blue-50 text-blue-800 rounded-lg border border-blue-200 text-sm">
                <strong>Admin Note:</strong> To add new users or reset passwords, please use the <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="underline font-bold">Supabase Dashboard</a>.
             </div>
          )}

          {/* Posts List */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
             <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Manage Articles</h3>
             </div>
             
             {loading ? (
                 <div className="p-10 text-center">Loading posts...</div>
             ) : posts.length === 0 ? (
                 <div className="p-10 text-center text-gray-500">No articles found. Write your first one!</div>
             ) : (
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {posts.map(post => {
                                const canEdit = user.role === UserRole.ADMIN || post.authorId === user.id;
                                
                                return (
                                    <tr key={post.id} className={!canEdit ? "opacity-50 bg-gray-50" : ""}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{post.title}</div>
                                            {!canEdit && <span className="text-xs text-red-400">Read only</span>}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {post.authorName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(post.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {canEdit && (
                                                <>
                                                    <Link to={`/blog/editor/${post.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</Link>
                                                    <button onClick={() => handleDelete(post.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                 </div>
             )}
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;