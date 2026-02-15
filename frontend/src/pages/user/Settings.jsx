import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navbar, Footer, Container, ProtectedRoute } from '../../components/layout';
import { Card, Input, Button, Alert } from '../../components/common';
import authService from '../../services/authService';
import { isValidPassword } from '../../utils/helpers';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user } = useAuth();
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [changing, setChanging] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (!isValidPassword(passwordData.newPassword)) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setChanging(true);
    try {
      await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setChanging(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />

        <Container className="py-12 flex-1">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Account Settings</h1>
              <p className="text-xl text-gray-600">Manage your account security and preferences</p>
            </div>

            {/* Change Password */}
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Change Password</h2>

              <form onSubmit={handlePasswordChange} className="space-y-6">
                <Input
                  label="Current Password"
                  name="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={handleChange}
                  error={errors.currentPassword}
                  required
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  }
                />

                <Input
                  label="New Password"
                  name="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handleChange}
                  error={errors.newPassword}
                  helperText="At least 6 characters"
                  required
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  }
                />

                <Input
                  label="Confirm New Password"
                  name="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  required
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                />

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Button
                    type="submit"
                    variant="primary"
                    loading={changing}
                  >
                    Change Password
                  </Button>
                </div>
              </form>
            </Card>

            {/* Account Information */}
            <Card className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Account Information</h2>

              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                  </div>
                  <span className="text-sm text-gray-500">Verified</span>
                </div>

                <div className="flex justify-between py-3 border-b border-gray-200">
                  <div>
                    <p className="font-medium text-gray-900">Account Status</p>
                    <p className="text-sm text-gray-600">
                      {user?.verified ? 'Verified Member' : 'Unverified'}
                    </p>
                  </div>
                </div>

                {user?.orgId && (
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <div>
                      <p className="font-medium text-gray-900">Organization</p>
                      <p className="text-sm text-gray-600">{user.orgId.name}</p>
                    </div>
                  </div>
                )}

                {user?.deptId && (
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <div>
                      <p className="font-medium text-gray-900">Department</p>
                      <p className="text-sm text-gray-600">{user.deptId.name}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Danger Zone */}
            <Card className="mt-6 border-red-200 bg-red-50">
              <h2 className="text-lg font-semibold text-red-900 mb-4">Danger Zone</h2>
              <p className="text-sm text-red-700 mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <Button variant="danger" size="sm">
                Delete Account
              </Button>
            </Card>
          </div>
        </Container>

        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default Settings;