import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import { getCurrentUser, logout, updatePassword } from '../../services/auth';
import { getPosts, deletePost, getUsers, addUser, deleteUser, updateUserRole } from '../../services/db';
import { BlogPost, User, UserRole } from '../../types';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // New User Form State (Admin Only)
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>(UserRole.EDITOR);
  const [userError, setUserError] = useState('');
  const [userSuccess, setUserSuccess] = useState('');

  // Change Password State (All Users)
  const [newPassword, setNewPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    const init = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        navigate('/blog/login');
        return;
      }
      setUser(currentUser);
      await refreshData(currentUser);
    };
    init();
  }, [navigate]);

  const refreshData = async (currentUser: User) => {
    setLoading(true);
    const postData = await getPosts();
    setPosts(postData);
    
    // Only fetch users if Admin
    if (currentUser.role === UserRole.ADMIN) {
        const usersData = await getUsers();
        setStaffList(usersData);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/blog/login');
  };

  const handleDelete = async (postId: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await deletePost(postId);
      const updatedPosts = await getPosts();
      setPosts(updatedPosts);
    }
  };

  // --- USER MANAGEMENT HANDLERS ---

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserError('');
    setUserSuccess('');

    try {
        await addUser(newUserEmail, newUserPassword, newUserRole);
        setUserSuccess(`User ${newUserEmail} created successfully!`);
        setNewUserEmail('');
        setNewUserPassword('');
        setShowAddUser(false);
        // Refresh list
        if (user) refreshData(user);
    } catch (err: any) {
        console.error(err);
        setUserError(err.message || "Failed to create user. Please ensure you have run the database setup script.");
    }
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    if (window.confirm(`Are you sure you want to delete user ${email}? This action cannot be undone.`)) {
        try {
            await deleteUser(userId);
            if (user) refreshData(user);
            setUserSuccess(`User ${email} deleted.`);
        } catch (err: any) {
            setUserError(err.message || "Failed to delete user.");
        }
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
      try {
          await updateUserRole(userId, newRole);
          if (user) refreshData(user);
          // We don't set success message here to avoid spamming UI, but the UI update confirms it
      } catch (err: any) {
          setUserError(err.message || "Failed to update role.");
      }
  };

  // --- PASSWORD HANDLERS ---

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage({ type: '', text: '' });
    
    if (newPassword.length < 6) {
        setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
        return;
    }

    try {
        await updatePassword(newPassword);
        setPasswordMessage({ type: 'success', text: 'Password updated successfully!' });
        setNewPassword('');
        setShowPasswordForm(false);
    } catch (err: any) {
        setPasswordMessage({ type: 'error', text: err.message || 'Failed to update password.' });
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
              <p className="text-gray-600">Welcome, {user.username} <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full uppercase ml-1">{user.role}</span></p>
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Posts (Takes up 2 cols) */}
            <div className="lg:col-span-2 space-y-8">
                {/* Posts List */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-900">Manage Articles</h3>
                    </div>
                    
                    {loading ? (
                        <div className="p-10 text-center">Loading...</div>
                    ) : posts.length === 0 ? (
                        <div className="p-10 text-center text-gray-500">No articles found. Write your first one!</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
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
                                                    <div className="text-sm font-medium text-gray-900 truncate max-w-[200px]">{post.title}</div>
                                                    {!canEdit && <span className="text-xs text-red-400">Read only</span>}
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

            {/* Right Column: Account & Team Management */}
            <div className="lg:col-span-1 space-y-8">
                
                {/* 1. My Account (Visible to everyone) */}
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                        <h3 className="text-lg font-medium text-gray-900">My Account</h3>
                        <button 
                            onClick={() => setShowPasswordForm(!showPasswordForm)}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                        >
                            {showPasswordForm ? 'Cancel' : 'Change Password'}
                        </button>
                    </div>
                    
                    {passwordMessage.text && (
                        <div className={`px-6 py-3 text-sm border-b ${passwordMessage.type === 'error' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
                            {passwordMessage.text}
                        </div>
                    )}

                    {showPasswordForm && (
                        <div className="p-6">
                            <form onSubmit={handleChangePassword}>
                                <div className="mb-3">
                                    <label className="block text-xs font-medium text-gray-700 mb-1">New Password</label>
                                    <input 
                                        type="password" 
                                        required
                                        minLength={6}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-church-primary focus:border-church-primary sm:text-sm"
                                        placeholder="Min. 6 characters"
                                    />
                                </div>
                                <button 
                                    type="submit"
                                    className="w-full bg-church-primary text-white py-2 px-4 rounded hover:bg-blue-800 text-sm font-bold"
                                >
                                    Update Password
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                {/* 2. Team Management (Admin Only) */}
                {user.role === UserRole.ADMIN && (
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-medium text-gray-900">Team Management</h3>
                            <button 
                                onClick={() => setShowAddUser(!showAddUser)}
                                className="text-xs bg-church-primary text-white px-3 py-1 rounded hover:bg-blue-800"
                            >
                                {showAddUser ? 'Close' : '+ Add User'}
                            </button>
                        </div>

                        {userSuccess && (
                            <div className="px-6 py-3 bg-green-50 text-green-700 text-sm border-b border-green-100">
                                {userSuccess}
                            </div>
                        )}
                         {userError && (
                            <div className="px-6 py-3 bg-red-50 text-red-700 text-sm border-b border-red-100">
                                {userError}
                            </div>
                        )}

                        {/* Add User Form */}
                        {showAddUser && (
                            <div className="p-6 bg-blue-50 border-b border-blue-100">
                                <form onSubmit={handleAddUser} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700">Email Address</label>
                                        <input 
                                            type="email" 
                                            required
                                            value={newUserEmail}
                                            onChange={(e) => setNewUserEmail(e.target.value.toLowerCase())}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-church-primary focus:border-church-primary sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700">Password</label>
                                        <input 
                                            type="password" 
                                            required
                                            minLength={6}
                                            value={newUserPassword}
                                            onChange={(e) => setNewUserPassword(e.target.value)}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-church-primary focus:border-church-primary sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700">Role</label>
                                        <select
                                            value={newUserRole}
                                            onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-church-primary focus:border-church-primary sm:text-sm"
                                        >
                                            <option value={UserRole.EDITOR}>Editor (Can post)</option>
                                            <option value={UserRole.ADMIN}>Admin (Full Access)</option>
                                        </select>
                                    </div>
                                    <button 
                                        type="submit"
                                        className="w-full bg-church-accent text-white py-2 px-4 rounded hover:bg-yellow-600 text-sm font-bold"
                                    >
                                        Create User
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Staff List */}
                        <div className="divide-y divide-gray-100">
                            {staffList.length === 0 ? (
                                <p className="p-6 text-sm text-gray-500 italic">No other staff found (or database functions not set up).</p>
                            ) : (
                                staffList.map((staff: any) => {
                                    const isSelf = staff.id === user.id;
                                    return (
                                        <div key={staff.id} className="px-6 py-4 flex items-center justify-between">
                                            <div className="overflow-hidden flex-1 mr-4">
                                                <p className="text-sm font-medium text-gray-900 truncate">{staff.email}</p>
                                                <p className="text-xs text-gray-500">Joined: {new Date(staff.created_at).toLocaleDateString()}</p>
                                            </div>
                                            
                                            <div className="flex items-center space-x-2">
                                                {isSelf ? (
                                                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                        YOU ({staff.role})
                                                    </span>
                                                ) : (
                                                    <>
                                                        <select
                                                            value={staff.role || 'EDITOR'}
                                                            onChange={(e) => handleRoleChange(staff.id, e.target.value as UserRole)}
                                                            className="text-xs border-gray-300 rounded shadow-sm focus:ring-church-primary focus:border-church-primary p-1"
                                                        >
                                                            <option value={UserRole.EDITOR}>Editor</option>
                                                            <option value={UserRole.ADMIN}>Admin</option>
                                                        </select>
                                                        
                                                        <button 
                                                            onClick={() => handleDeleteUser(staff.id, staff.email)}
                                                            className="text-gray-400 hover:text-red-600 p-1"
                                                            title="Delete User"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;