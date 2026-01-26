import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../../components/Layout.tsx';
import { BlogPost as BlogPostType } from '../../types.ts';
import { getPostById } from '../../services/db.ts';
import MarkdownRenderer from '../../components/MarkdownRenderer.tsx';

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (id) {
        const data = await getPostById(id);
        setPost(data || null);
      }
      setLoading(false);
    };
    fetchPost();
  }, [id]);

  if (loading) {
     return (
        <Layout>
            <div className="flex justify-center py-32">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-church-primary"></div>
            </div>
        </Layout>
     )
  }

  if (!post) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Post not found</h1>
          <Link to="/blog" className="text-church-primary underline mt-4 inline-block">Back to News</Link>
        </div>
      </Layout>
    );
  }

  // Helper to extract YouTube ID
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const youtubeId = post.videoUrl ? getYouTubeId(post.videoUrl) : null;

  return (
    <Layout>
      <article className="max-w-3xl mx-auto px-4 py-16">
        <div className="mb-8 text-center">
            <span className="text-church-accent font-bold uppercase tracking-wide text-sm">{new Date(post.createdAt).toLocaleDateString()}</span>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mt-2 mb-4">{post.title}</h1>
            <div className="flex items-center justify-center text-gray-500 text-sm">
                <span>By {post.authorName}</span>
            </div>
        </div>

        {post.imageUrl && (
            <div className="mb-10 rounded-xl overflow-hidden shadow-lg">
                <img src={post.imageUrl} alt={post.title} className="w-full h-auto" />
            </div>
        )}

        {youtubeId && (
            <div className="mb-10 aspect-w-16 aspect-h-9 bg-black rounded-xl overflow-hidden shadow-lg">
                <iframe 
                    width="100%" 
                    height="450" 
                    src={`https://www.youtube.com/embed/${youtubeId}`} 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    className="w-full"
                ></iframe>
            </div>
        )}

        {/* Use the new Markdown Renderer for content */}
        <div className="prose prose-lg prose-blue mx-auto text-gray-700">
            <MarkdownRenderer content={post.content} />
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
            <Link to="/blog" className="text-gray-500 hover:text-church-primary font-medium">
                &larr; Back to all articles
            </Link>
        </div>
      </article>
    </Layout>
  );
};

export default BlogPost;