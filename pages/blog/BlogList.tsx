import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout.tsx';
import { BlogPost } from '../../types.ts';
import { getPosts, initializeDatabase } from '../../services/db.ts';
import { Link } from 'react-router-dom';

const BlogList: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeDatabase();
    const fetchPosts = async () => {
      try {
        const data = await getPosts();
        setPosts(data);
      } catch (error) {
        console.error("Failed to load posts", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Helper to remove markdown symbols for clean preview text
  const stripMarkdown = (text: string) => {
    if (!text) return '';
    return text
      .replace(/(\*\*|__)(.*?)\1/g, '$2') // Remove Bold
      .replace(/(\*|_)(.*?)\1/g, '$2')    // Remove Italic
      .replace(/^(\- |\* |\d+\. )/gm, '') // Remove List bullets
      .replace(/\n+/g, ' ');              // Collapse newlines
  };

  return (
    <Layout>
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-4xl font-serif font-bold text-church-primary">News & Updates</h1>
              <p className="text-gray-500 mt-2">Latest happenings at First Baptist East Prairie</p>
            </div>
            <Link 
              to="/blog/login" 
              className="text-sm font-semibold text-gray-500 hover:text-church-primary underline"
            >
              Staff Login
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-church-primary"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No news articles found.</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <article key={post.id} className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition overflow-hidden">
                  {post.imageUrl && (
                    <div className="h-48 w-full overflow-hidden">
                      <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover transition hover:scale-105 duration-500" />
                    </div>
                  )}
                  {post.videoUrl && !post.imageUrl && (
                     <div className="h-48 w-full bg-black flex items-center justify-center text-white">
                        <span className="text-xs uppercase tracking-widest">Video Content</span>
                     </div>
                  )}
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center text-xs text-gray-500 mb-3">
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        <span className="mx-2">•</span>
                        <span>{post.authorName}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        <Link to={`/blog/post/${post.id}`} className="hover:text-church-secondary">
                          {post.title}
                        </Link>
                      </h3>
                      <p className="text-gray-600 line-clamp-3 mb-4">
                        {stripMarkdown(post.content)}
                      </p>
                    </div>
                    <Link to={`/blog/post/${post.id}`} className="inline-block text-church-accent font-semibold hover:text-yellow-600">
                      Read more &rarr;
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BlogList;