import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Select, Textarea, Button, Alert, Card, Loading } from '../../components/common';
import { Container } from '../../components/layout';
import { organizationService, departmentService, authService } from '../../services';
import { ROUTES } from '../../utils/constants';
import toast from 'react-hot-toast';

const RequestVerification = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [organizations, setOrganizations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loadingOrgs, setLoadingOrgs] = useState(true);
  const [loadingDepts, setLoadingDepts] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    organizationName: '',
    departmentName: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  // Fetch organizations on mount
  useEffect(() => {
    fetchOrganizations();
  }, []);

  // Fetch departments when organization is selected
  useEffect(() => {
    if (formData.organizationName) {
      fetchDepartments(formData.organizationName);
    } else {
      setDepartments([]);
      setFormData(prev => ({ ...prev, departmentName: '' }));
    }
  }, [formData.organizationName]);

  const fetchOrganizations = async () => {
    try {
      const response = await organizationService.getOrganizations();
      setOrganizations(response.data?.organizations || []);
    } catch (error) {
      console.error('Error fetching organizations:', error);
      toast.error('Failed to load organizations');
    } finally {
      setLoadingOrgs(false);
    }
  };

  const fetchDepartments = async (orgName) => {
    setLoadingDepts(true);
    try {
      // Find org by name
      const org = organizations.find(o => o.name === orgName);
      if (!org) return;

      // Fetch departments for this organization
      const response = await departmentService.getDepartmentsByOrganization(org.id);
      setDepartments(response.data?.departments || []);
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast.error('Failed to load departments');
    } finally {
      setLoadingDepts(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setServerError('');
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.organizationName) {
      newErrors.organizationName = 'Please select an organization';
    }

    if (!formData.departmentName) {
      newErrors.departmentName = 'Please select a department';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    setSubmitting(true);

    try {
      await authService.requestVerification(formData);
      toast.success('Verification request submitted successfully!');
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      setServerError(error.response?.data?.message || 'Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingOrgs) {
    return <Loading.Page text="Loading organizations..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Container size="sm">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-4">
            <svg className="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Request Verification</h1>
          <p className="text-gray-600">
            Get verified to start posting blogs and commenting
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {serverError && (
              <Alert type="error" message={serverError} onClose={() => setServerError('')} />
            )}

            {/* Info Alert */}
            <Alert type="info">
              <p className="text-sm">
                Verification allows you to:
              </p>
              <ul className="text-sm mt-2 space-y-1 list-disc list-inside">
                <li>Create and publish blog posts</li>
                <li>Comment on posts</li>
                <li>Join your organization's community</li>
              </ul>
            </Alert>

            <Select
              label="Organization"
              name="organizationName"
              value={formData.organizationName}
              onChange={handleChange}
              options={organizations.map(org => ({
                value: org.name,
                label: org.name,
              }))}
              placeholder="Select your organization"
              error={errors.organizationName}
              required
            />

            <Select
              label="Department"
              name="departmentName"
              value={formData.departmentName}
              onChange={handleChange}
              options={departments.map(dept => ({
                value: dept.name,
                label: dept.name,
              }))}
              placeholder={loadingDepts ? 'Loading departments...' : 'Select your department'}
              error={errors.departmentName}
              disabled={!formData.organizationName || loadingDepts}
              required
              helperText={!formData.organizationName ? 'Please select an organization first' : ''}
            />

            <Textarea
              label="Message (Optional)"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us why you want to join this organization..."
              rows={4}
              maxLength={500}
              showCount
              helperText="Explain your affiliation with the organization (e.g., student ID, employee ID)"
            />

            <div className="flex gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate(ROUTES.DASHBOARD)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={submitting}
                className="flex-1"
              >
                Submit Request
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-medium text-gray-900 mb-2">What happens next?</h3>
            <ol className="text-sm text-gray-600 space-y-2">
              <li className="flex gap-2">
                <span className="flex-shrink-0 w-5 h-5 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium">
                  1
                </span>
                <span>Your request will be reviewed by department administrators</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0 w-5 h-5 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium">
                  2
                </span>
                <span>You'll receive a notification when your request is reviewed</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0 w-5 h-5 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium">
                  3
                </span>
                <span>Once approved, you can start creating content!</span>
              </li>
            </ol>
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default RequestVerification;