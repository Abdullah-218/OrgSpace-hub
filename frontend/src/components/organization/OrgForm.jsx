import { useState } from 'react';
import { Input, Textarea, Button, ImageUpload } from '../common';

const OrgForm = ({ organization = null, onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    name: organization?.name || '',
    about: organization?.about || '',
    logo: organization?.logo || '',
    coverImage: organization?.coverImage || '',
    website: organization?.website || '',
    email: organization?.email || '',
  });
  const [errors, setErrors] = useState({});

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
      newErrors.name = 'Organization name is required';
    }
    if (!formData.about.trim()) {
      newErrors.about = 'Description is required';
    }
    if (formData.website && !formData.website.startsWith('http')) {
      newErrors.website = 'Website must be a valid URL (starting with http:// or https://)';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
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
        label="Organization Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        required
        placeholder="Enter organization name"
      />

      <Textarea
        label="About"
        name="about"
        value={formData.about}
        onChange={handleChange}
        error={errors.about}
        rows={4}
        required
        placeholder="Describe your organization"
        maxLength={500}
        showCount
      />

      <ImageUpload
        label="Logo"
        type="organizations"
        currentImage={formData.logo}
        onUpload={(url) => setFormData(prev => ({ ...prev, logo: url }))}
        helperText="Upload organization logo (recommended: 200x200px)"
      />

      <ImageUpload
        label="Cover Image (Optional)"
        type="organizations"
        currentImage={formData.coverImage}
        onUpload={(url) => setFormData(prev => ({ ...prev, coverImage: url }))}
        helperText="Upload cover image (recommended: 1200x400px)"
      />

      <Input
        label="Website"
        name="website"
        type="url"
        value={formData.website}
        onChange={handleChange}
        error={errors.website}
        placeholder="https://example.com"
      />

      <Input
        label="Contact Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        placeholder="contact@example.com"
      />

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
          {organization ? 'Update Organization' : 'Create Organization'}
        </Button>
      </div>
    </form>
  );
};

export default OrgForm;