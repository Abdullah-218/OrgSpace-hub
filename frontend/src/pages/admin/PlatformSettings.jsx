import { useState } from 'react';
import { Navbar, Footer, Container, Sidebar, ProtectedRoute } from '../../components/layout';
import { Card, Button, Input, Textarea, ImageUpload } from '../../components/common';
import { ROUTES, ROLES } from '../../utils/constants';
import toast from 'react-hot-toast';

const PlatformSettings = () => {
  const [settings, setSettings] = useState({
    platformName: 'Blog Platform',
    tagline: 'Share your story with your community',
    description: 'A modern blogging platform for organizations',
    logo: '',
    maxFileSize: 5242880,
    allowedFileTypes: 'image/jpeg,image/jpg,image/png,image/gif,image/webp',
    enableComments: true,
    enableLikes: true,
    enableRegistration: true,
    maintenanceMode: false,
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulate save
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const sidebarItems = [
    {
      label: 'Dashboard',
      path: ROUTES.SUPER_ADMIN_DASHBOARD,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      label: 'Settings',
      path: '/admin/settings',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  return (
    <ProtectedRoute requiredRole={ROLES.SUPER_ADMIN}>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />

        <div className="flex flex-1">
          <Sidebar items={sidebarItems} title="Super Admin" />

          <div className="flex-1">
            <Container className="py-12">
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Platform Settings</h1>
                <p className="text-xl text-gray-600">Configure platform-wide settings</p>
              </div>

              <div className="space-y-6">
                <Card>
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">General Settings</h2>
                  <div className="space-y-6">
                    <Input
                      label="Platform Name"
                      name="platformName"
                      value={settings.platformName}
                      onChange={handleChange}
                    />

                    <Input
                      label="Tagline"
                      name="tagline"
                      value={settings.tagline}
                      onChange={handleChange}
                    />

                    <Textarea
                      label="Description"
                      name="description"
                      value={settings.description}
                      onChange={handleChange}
                      rows={4}
                    />

                    <ImageUpload
                      label="Platform Logo"
                      type="organizations"
                      currentImage={settings.logo}
                      onUpload={(url) => setSettings(prev => ({ ...prev, logo: url }))}
                    />
                  </div>
                </Card>

                <Card>
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Upload Settings</h2>
                  <div className="space-y-6">
                    <Input
                      label="Max File Size (bytes)"
                      name="maxFileSize"
                      type="number"
                      value={settings.maxFileSize}
                      onChange={handleChange}
                      helperText="Default: 5MB (5242880 bytes)"
                    />

                    <Input
                      label="Allowed File Types"
                      name="allowedFileTypes"
                      value={settings.allowedFileTypes}
                      onChange={handleChange}
                      helperText="Comma-separated MIME types"
                    />
                  </div>
                </Card>

                <Card>
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Feature Toggles</h2>
                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="enableComments"
                        checked={settings.enableComments}
                        onChange={handleChange}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-3 text-sm text-gray-900">Enable Comments</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="enableLikes"
                        checked={settings.enableLikes}
                        onChange={handleChange}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-3 text-sm text-gray-900">Enable Likes</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="enableRegistration"
                        checked={settings.enableRegistration}
                        onChange={handleChange}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-3 text-sm text-gray-900">Enable User Registration</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="maintenanceMode"
                        checked={settings.maintenanceMode}
                        onChange={handleChange}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="ml-3 text-sm text-gray-900">Maintenance Mode</span>
                    </label>
                  </div>
                </Card>

                <div className="flex gap-3">
                  <Button
                    variant="primary"
                    onClick={handleSave}
                    loading={saving}
                  >
                    Save Settings
                  </Button>
                  <Button variant="ghost">
                    Reset to Defaults
                  </Button>
                </div>
              </div>
            </Container>
          </div>
        </div>

        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default PlatformSettings;
ENDOFFILE