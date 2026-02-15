import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Navbar, Footer, Container, ProtectedRoute } from '../../components/layout';
import { Card, Input, Textarea, Button, ImageUpload, Badge, Loading } from '../../components/common';
import blogService from '../../services/blogService';
import { ROUTES } from '../../utils/constants';
import toast from 'react-hot-toast';

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    coverImage: '',
    tags: '',
    published: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const response = await blogService.getBlogById(id);
      const blog = response.data.blog;
      setFormData({
        title: blog.title,
        content: blog.content,
        excerpt: blog.excerpt || '',
        coverImage: blog.coverImage || '',
        tags: blog.tags ? blog.tags.join(', ') : '',
        published: blog.published,
      });
    } catch (error) {
      toast.error('Failed to load blog');
      navigate(ROUTES.MY_BLOGS);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = (url) => {
    setFormData(prev => ({ ...prev, coverImage: url }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.content.trim()) newErrors.content = 'Content is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (published) => {
    if (!validate()) return;

    setSaving(true);
    try {
      const blogData = {
        ...formData,
        published,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
      };

      await blogService.updateBlog(id, blogData);
      toast.success('Blog updated successfully!');
      navigate(ROUTES.MY_BLOGS);
    } catch (error) {
      toast.error('Failed to update blog');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requireVerified>
        <Navbar />
        <Loading.Page text="Loading blog..." />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireVerified>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />

        <Container size="default" className="py-12 flex-1">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Blog</h1>
              <p className="text-xl text-gray-600">Update your blog post</p>
            </div>

            <Card>
              <div className="space-y-6">
                <Input
                  label="Title"
                  name="title"
                  placeholder="Enter an engaging title..."
                  value={formData.title}
                  onChange={handleChange}
                  error={errors.title}
                  required
                />

                <Textarea
                  label="Excerpt"
                  name="excerpt"
                  placeholder="Write a brief summary (optional)..."
                  value={formData.excerpt}
                  onChange={handleChange}
                  rows={3}
                  maxLength={200}
                  showCount
                />

                <ImageUpload
                  label="Cover Image (Optional)"
                  type="blogs"
                  currentImage={formData.coverImage}
                  onUpload={handleImageUpload}
                />

                <Textarea
                  label="Content"
                  name="content"
                  placeholder="Write your blog content here..."
                  value={formData.content}
                  onChange={handleChange}
                  error={errors.content}
                  rows={15}
                  required
                />

                <Input
                  label="Tags"
                  name="tags"
                  placeholder="technology, programming, web development"
                  value={formData.tags}
                  onChange={handleChange}
                  helperText="Comma-separated tags"
                />

                {formData.tags && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.split(',').map((tag, index) => (
                      tag.trim() && (
                        <Badge key={index} variant="primary">
                          {tag.trim()}
                        </Badge>
                      )
                    ))}
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Button
                    variant="ghost"
                    onClick={() => navigate(ROUTES.MY_BLOGS)}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSubmit(false)}
                    loading={saving}
                    disabled={saving}
                  >
                    Save as Draft
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => handleSubmit(true)}
                    loading={saving}
                    disabled={saving}
                  >
                    {formData.published ? 'Update Blog' : 'Publish Blog'}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </Container>

        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default EditBlog;