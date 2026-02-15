import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Navbar, Footer, Container } from '../../components/layout';
import { Card, Loading, Badge, Avatar, Button } from '../../components/common';
import blogService from '../../services/blogService';
import { ROUTES } from '../../utils/constants';
import { formatDate, formatNumber } from '../../utils/helpers';
import toast from 'react-hot-toast';

const BlogDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const response = await blogService.getBlogById(id);
      setBlog(response.data.blog);
      setLiked(response.data.blog.hasLiked);
      setLikeCount(response.data.blog.likeCount || 0);
    } catch (error) {
      toast.error('Failed to load blog');
      navigate(ROUTES.BLOGS);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like posts');
      navigate(ROUTES.LOGIN);
      return;
    }

    try {
      await blogService.toggleLike(id);
      setLiked(!liked);
      setLikeCount(prev => liked ? prev - 1 : prev + 1);
      toast.success(liked ? 'Post unliked' : 'Post liked!');
    } catch (error) {
      toast.error('Failed to like post');
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Loading.Page text="Loading blog..." />
      </>
    );
  }

  if (!blog) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <Container size="default" className="py-12 flex-1">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(ROUTES.BLOGS)}
            className="mb-6"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blogs
          </Button>

          <Card>
            {/* Cover Image */}
            {blog.coverImage && (
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="w-full h-96 object-cover rounded-lg mb-6"
              />
            )}

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {blog.tags.map((tag, index) => (
                  <Badge key={index} variant="primary" size="sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {blog.title}
            </h1>

            {/* Author & Meta */}
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Avatar
                  src={blog.authorId?.avatar}
                  name={blog.authorId?.name}
                  size="lg"
                />
                <div>
                  <div className="font-medium text-gray-900">
                    {blog.authorId?.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatDate(blog.createdAt, 'long')} · {blog.viewCount || 0} views
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  variant={liked ? "primary" : "outline"}
                  size="sm"
                  onClick={handleLike}
                >
                  <svg className="w-5 h-5 mr-1" fill={liked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {formatNumber(likeCount)}
                </Button>
              </div>
            </div>

            {/* Content */}
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </Card>
        </div>
      </Container>

      <Footer />
    </div>
  );
};

export default BlogDetailPage;