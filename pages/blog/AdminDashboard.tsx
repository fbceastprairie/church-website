import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import { getCurrentUser, logout } from '../../services/auth';
import { getPosts, deletePost, addUser } from '../../services/db';
import { BlogPost, User, UserRole } from '../../types';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  // New user form state
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserUser, setNewUserUser] = useState('');
  const [newUserPass, setNewUserPass] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>(UserRole.EDITOR);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/blog/login');
      return;
    }
    setUser(currentUser);
    refreshPosts();
  }, [navigate]);

  const refreshPosts = async () => {
    const data = await getPosts();
    setPosts(data);
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/blog/login');
  };

  const handleDelete = async (postId: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await deletePost(postId);
      refreshPosts();
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserUser || !newUserPass) return;
    try {
      await addUser(newUserUser, newUserPass, newUserRole);
      alert('User added successfully');
      setNewUserUser('');
      setNewUserPass('');
      setShowAddUser(false);
    } catch (err: any) {
      alert(err.message || 'Failed to add user');
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

          {/* Admin Only Section: Add Users */}
          {user.role === UserRole.ADMIN && (
            <div className="bg-white shadow rounded-lg mb-8 overflow-hidden">
                <div 
                    className="bg-gray-50 px-6 py-4 border-b border-gray-200 cursor-pointer flex justify-between items-center"
                    onClick={() => setShowAddUser(!showAddUser)}
                >
                    <h3 className="text-lg font-medium text-gray-900">User Management</h3>
                    <span className="text-gray-500">{showAddUser ? '▼' : '►'}</span>
                </div>
                {showAddUser && (
                    <div className="p-6">
                        <form onSubmit={handleAddUser} className="flex flex-col md:flex-row gap-4 items-end">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700">Username</label>
                                <input type="text" value={newUserUser} onChange={e => setNewUserUser(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <input type="password" value={newUserPass} onChange={e => setNewUserPass(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                            </div>
                            <div className="w-40">
                                <label className="block text-sm font-medium text-gray-700">Role</label>
                                <select value={newUserRole} onChange={e => setNewUserRole(e.target.value as UserRole)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                    <option value={UserRole.EDITOR}>Editor</option>
                                    <option value={UserRole.ADMIN}>Admin</option>
                                </select>
                            </div>
                            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700">Add User</button>
                        </form>
                    </div>
                )}
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