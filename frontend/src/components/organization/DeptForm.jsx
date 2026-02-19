
import { useState, useEffect } from 'react';
import { Input, Textarea, Button } from '../common';
import organizationService from '../../services/organizationService';

const DeptForm = ({ 
  department = null, 
  organizationId = null,
  onSubmit, 
  onCancel, 
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    name: department?.name || '',
    description: department?.description || '',
    orgId: department?.orgId?._id || organizationId || '',
  });
  const [organizations, setOrganizations] = useState([]);
  const [errors, setErrors] = useState({});
  const [loadingOrgs, setLoadingOrgs] = useState(false);

  useEffect(() => {
    if (!organizationId) {
      fetchOrganizations();
    }
  }, []);

  const fetchOrganizations = async () => {
    setLoadingOrgs(true);
    try {
      const response = await organizationService.getOrganizations();
      setOrganizations(response.data.organizations);
    } catch (error) {
      console.error('Failed to fetch organizations');
    } finally {
      setLoadingOrgs(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Department name is required';
    }
    if (!formData.orgId) {
      newErrors.orgId = 'Organization is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Department Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        required
        placeholder="Enter department name"
      />

      <Textarea
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        rows={4}
        placeholder="Describe this department"
        maxLength={300}
        showCount
      />

      {!organizationId && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Organization <span className="text-red-500">*</span>
          </label>
          <select
            name="orgId"
            value={formData.orgId}
            onChange={handleChange}
            disabled={loadingOrgs || organizationId}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
              errors.orgId ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select organization</option>
            {organizations.map((org) => (
              <option key={org._id} value={org._id}>
                {org.name}
              </option>
            ))}
          </select>
          {errors.orgId && (
            <p className="mt-1 text-sm text-red-600">{errors.orgId}</p>
          )}
        </div>
      )}

      {organizationId && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">
            This department will be created in the current organization
          </p>
        </div>
      )}

      <div className="flex gap-3 pt-4 border-t border-gray-200">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          loading={loading}
        >
          {department ? 'Update Department' : 'Create Department'}
        </Button>
      </div>
    </form>
  );
};

export default DeptForm;