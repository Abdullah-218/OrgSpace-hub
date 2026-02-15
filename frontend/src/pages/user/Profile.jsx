import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navbar, Footer, Container, ProtectedRoute } from '../../components/layout';
import { Card, Input, Textarea, Button, Avatar, Badge, ImageUpload } from '../../components/common';
import authService from '../../services/authService';
import { ROLE_LABELS } from '../../utils/constants';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = (url) => {
    setFormData(prev => ({ ...prev, avatar: url }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (formData.name.length < 2) newErrors.name = 'Name must be at least 2 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const response = await authService.updateProfile(formData);
      updateUser(response.data.user);
      toast.success('Profile updated successfully!');
      setEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      bio: user?.bio || '',
      avatar: user?.avatar || '',
    });
    setErrors({});
    setEditing(false);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />

        <Container className="py-12 flex-1">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
              <p className="text-xl text-gray-600">Manage your account information</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Profile Info */}
              <Card className="lg:col-span-1">
                <div className="text-center">
                  <Avatar
                    src={user?.avatar}
                    name={user?.name}
                    size="2xl"
                    className="mx-auto mb-4"
                  />
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">
                    {user?.name}
                  </h2>
                  <p className="text-gray-600 mb-3">{user?.email}</p>
                  <Badge variant={user?.verified ? 'success' : 'warning'}>
                    {user?.verified ? 'Verified' : 'Unverified'}
                  </Badge>
                  <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600 space-y-2">
                    <div>
                      <span className="font-medium">Role:</span> {ROLE_LABELS[user?.role]}
                    </div>
                    <div>
                      <span className="font-medium">Joined:</span> {formatDate(user?.createdAt, 'short')}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Edit Form */}
              <Card className="lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
                  {!editing && (
                    <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
                      Edit Profile
                    </Button>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {editing && (
                    <ImageUpload
                      label="Profile Picture"
                      type="avatars"
                      currentImage={formData.avatar}
                      onUpload={handleImageUpload}
                      helperText="Upload a profile picture"
                    />
                  )}

                  <Input
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                    required
                    disabled={!editing}
                  />

                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={user?.email}
                    disabled
                    helperText="Email cannot be changed"
                  />

                  <Textarea
                    label="Bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    maxLength={200}
                    showCount
                    disabled={!editing}
                    helperText="Tell us about yourself"
                  />

                  {user?.orgId && (
                    <Input
                      label="Organization"
                      value={user.orgId.name || 'N/A'}
                      disabled
                    />
                  )}

                  {user?.deptId && (
                    <Input
                      label="Department"
                      value={user.deptId.name || 'N/A'}
                      disabled
                    />
                  )}

                  {editing && (
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handleCancel}
                        disabled={saving}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        loading={saving}
                      >
                        Save Changes
                      </Button>
                    </div>
                  )}
                </form>
              </Card>
            </div>
          </div>
        </Container>

        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default Profile;