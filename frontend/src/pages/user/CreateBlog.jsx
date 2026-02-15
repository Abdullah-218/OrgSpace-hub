import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Footer, Container, ProtectedRoute } from '../../components/layout';
import { Card, Input, Textarea, Button, ImageUpload, Badge } from '../../components/common';
import blogService from '../../services/blogService';
import { ROUTES } from '../../utils/constants';
import toast from 'react-hot-toast';

const CreateBlog = () => {
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
  const [saving, setSaving] = useState(false);

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
    if (formData.title.length < 10) newErrors.title = 'Title must be at least 10 characters';
    if (formData.content.length < 50) newErrors.content = 'Content must be at least 50 characters';
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

      await blogService.createBlog(blogData);
      toast.success(published ? 'Blog published successfully!' : 'Blog saved as draft!');
      navigate(ROUTES.MY_BLOGS);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create blog');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute requireVerified>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />

        <Container size="default" className="py-12 flex-1">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Blog</h1>
              <p className="text-xl text-gray-600">Share your story with the community</p>
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
                  helperText={`${formData.title.length}/100 characters`}
                  maxLength={100}
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
                  helperText="This will appear in blog listings"
                />

                <ImageUpload
                  label="Cover Image (Optional)"
                  type="blogs"
                  currentImage={formData.coverImage}
                  onUpload={handleImageUpload}
                  helperText="Upload a cover image for your blog"
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
                  helperText={`${formData.content.length} characters`}
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
                    Publish Blog
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

export default CreateBlog;