import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout.tsx';
import { BlogPost } from '../../types.ts';
import { getPosts, initializeDatabase } from '../../services/db.ts';
import { Link } from 'react-router-dom';
import { ASSETS } from '../../constants.ts';

const BlogList: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;

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

  // Helper to determine which image to show
  const getPreviewImage = (post: BlogPost) => {
    if (post.imageUrl) return post.imageUrl;
    if (post.videoUrl) return ASSETS.DEFAULT_VIDEO_THUMBNAIL;
    return ASSETS.DEFAULT_BLOG_THUMBNAIL;
  };

  // Pagination Logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
            <>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {currentPosts.map((post) => {
                    // Fallback to ID if slug is missing (for old posts before migration)
                    const postLink = `/blog/post/${post.slug || post.id}`;
                    
                    return (
                      <article key={post.id} className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition overflow-hidden group">
                        <Link to={postLink} className="block h-48 w-full overflow-hidden relative cursor-pointer">
                          <img 
                            src={getPreviewImage(post)} 
                            alt={post.title} 
                            className="w-full h-full object-cover transition group-hover:scale-105 duration-500" 
                          />
                          
                          {/* Video Indicator Overlay */}
                          {post.videoUrl && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition">
                                <div className="bg-black/60 rounded-full p-3 backdrop-blur-sm">
                                    <svg className="w-8 h-8 text-white pl-1" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" /></svg>
                                </div>
                            </div>
                          )}
                        </Link>

                        <div className="flex-1 p-6 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center text-xs text-gray-500 mb-3">
                              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                              <span className="mx-2">•</span>
                              <span>{post.authorName}</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                              <Link to={postLink} className="hover:text-church-secondary">
                                {post.title}
                              </Link>
                            </h3>
                            <p className="text-gray-600 line-clamp-3 mb-4 text-sm">
                              {stripMarkdown(post.content)}
                            </p>
                          </div>
                          <Link to={postLink} className="inline-block text-church-accent font-semibold hover:text-yellow-600 text-sm uppercase tracking-wide">
                            Read more &rarr;
                          </Link>
                        </div>
                      </article>
                    );
                })}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-12 space-x-2">
                  <button 
                    onClick={() => paginate(currentPage - 1)} 
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => paginate(i + 1)}
                      className={`px-4 py-2 border rounded-md text-sm font-medium ${
                        currentPage === i + 1 
                          ? 'bg-church-primary border-church-primary text-white' 
                          : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button 
                    onClick={() => paginate(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BlogList;