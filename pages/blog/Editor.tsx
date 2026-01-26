import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../components/Layout.tsx';
import { getCurrentUser } from '../../services/auth.ts';
import { createPost, getPostById, updatePost } from '../../services/db.ts';
import { User, UserRole } from '../../types.ts';

const Editor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [user, setUser] = useState<User | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        navigate('/blog/login');
        return;
      }
      setUser(currentUser);

      if (isEditing && id) {
        const post = await getPostById(id);
        if (post) {
            // Permission check: Admin can edit all, Editor can only edit own
            if (currentUser.role !== UserRole.ADMIN && post.authorId !== currentUser.id) {
                alert("You do not have permission to edit this post.");
                navigate('/blog/admin');
                return;
            }
          setTitle(post.title);
          setContent(post.content);
          setImageUrl(post.imageUrl || '');
          setVideoUrl(post.videoUrl || '');
        }
      }
      setFetchLoading(false);
    };

    init();
  }, [id, isEditing, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      if (isEditing && id) {
        await updatePost(id, {
          title,
          content,
          imageUrl: imageUrl || null,
          videoUrl: videoUrl || null,
        });
      } else {
        await createPost({
          title,
          content,
          imageUrl: imageUrl || null,
          videoUrl: videoUrl || null,
          authorId: user.id,
          authorName: user.username,
        });
      }
      navigate('/blog/admin');
    } catch (error) {
      console.error(error);
      alert('Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <Layout><div className="p-20 text-center">Loading editor...</div></Layout>;

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between mb-8">
             <h1 className="text-3xl font-bold text-gray-900">{isEditing ? 'Edit Post' : 'New Article'}</h1>
             <button onClick={() => navigate('/blog/admin')} className="text-gray-500 hover:text-church-primary">Cancel</button>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-church-primary focus:border-church-primary"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Image URL (Optional)</label>
                <input
                  type="url"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-church-primary focus:border-church-primary"
                  placeholder="https://..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
                <p className="mt-1 text-xs text-gray-500">Paste a direct link to an image.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">YouTube Video URL (Optional)</label>
                <input
                  type="url"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-church-primary focus:border-church-primary"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Content</label>
                <textarea
                  required
                  rows={12}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-church-primary focus:border-church-primary font-sans"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your article here..."
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-church-primary hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-church-primary disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Publish Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Editor;