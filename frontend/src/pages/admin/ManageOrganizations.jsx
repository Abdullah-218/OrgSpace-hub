import { useState, useEffect } from 'react';
import { Navbar, Footer, Container, Sidebar, ProtectedRoute } from '../../components/layout';
import { Card, Button, SearchBar, Loading, EmptyState, Modal, Input, Textarea, ImageUpload, ConfirmDialog, Badge } from '../../components/common';
import organizationService from '../../services/organizationService';
import { ROUTES, ROLES } from '../../utils/constants';
import { formatNumber } from '../../utils/helpers';
import toast from 'react-hot-toast';

const ManageOrganizations = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingOrg, setEditingOrg] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    about: '',
    logo: '',
    coverImage: '',
    website: '',
    email: '',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const response = await organizationService.getOrganizations({ limit: 100 });
      setOrganizations(response.data.organizations);
    } catch (error) {
      toast.error('Failed to load organizations');
    } finally {
      setLoading(false);
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
    if (!formData.name.trim()) newErrors.name = 'Organization name is required';
    if (!formData.about.trim()) newErrors.about = 'About is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      if (editingOrg) {
        await organizationService.updateOrganization(editingOrg._id, formData);
        toast.success('Organization updated successfully!');
      } else {
        await organizationService.createOrganization(formData);
        toast.success('Organization created successfully!');
      }
      handleCloseModal();
      fetchOrganizations();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (org) => {
    setEditingOrg(org);
    setFormData({
      name: org.name,
      about: org.about || '',
      logo: org.logo || '',
      coverImage: org.coverImage || '',
      website: org.website || '',
      email: org.email || '',
    });
    setShowCreateModal(true);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await organizationService.deleteOrganization(deleteId);
      setOrganizations(organizations.filter(org => org._id !== deleteId));
      toast.success('Organization deleted successfully');
      setDeleteId(null);
    } catch (error) {
      toast.error('Failed to delete organization');
    } finally {
      setDeleting(false);
    }
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingOrg(null);
    setFormData({ name: '', about: '', logo: '', coverImage: '', website: '', email: '' });
    setErrors({});
  };

  const filteredOrgs = organizations.filter(org =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      label: 'Organizations',
      path: ROUTES.MANAGE_ORGS,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
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
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-4xl font-bold text-gray-900">Manage Organizations</h1>
                  <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Organization
                  </Button>
                </div>
                <p className="text-xl text-gray-600">Create and manage platform organizations</p>
              </div>

              <div className="mb-6">
                <SearchBar
                  placeholder="Search organizations..."
                  value={searchTerm}
                  onChange={setSearchTerm}
                  className="max-w-2xl"
                />
              </div>

              {loading ? (
                <Loading.CardSkeleton count={6} />
              ) : filteredOrgs.length === 0 ? (
                <EmptyState
                  title="No organizations found"
                  description={searchTerm ? "Try a different search term" : "Create your first organization"}
                  action={
                    !searchTerm && (
                      <Button onClick={() => setShowCreateModal(true)}>
                        Create Organization
                      </Button>
                    )
                  }
                />
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredOrgs.map((org) => (
                    <Card key={org._id} hover>
                      <div className="w-full h-32 bg-gradient-to-br from-primary-500 to-purple-500 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                        {org.logo ? (
                          <img src={org.logo} alt={org.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-4xl font-bold text-white">{org.name.charAt(0)}</span>
                        )}
                      </div>
                      
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{org.name}</h3>
                        <Badge variant={org.active ? 'success' : 'gray'}>
                          {org.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{org.about}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <span>{formatNumber(org.memberCount || 0)} members</span>
                        <span>·</span>
                        <span>{formatNumber(org.departmentCount || 0)} depts</span>
                      </div>
                      
                      <div className="flex gap-2 pt-4 border-t border-gray-200">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(org)} className="flex-1">
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteId(org._id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Container>
          </div>
        </div>

        <Footer />

        <Modal
          isOpen={showCreateModal}
          onClose={handleCloseModal}
          title={editingOrg ? 'Edit Organization' : 'Create Organization'}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Organization Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
            />

            <Textarea
              label="About"
              name="about"
              value={formData.about}
              onChange={handleChange}
              error={errors.about}
              rows={4}
              required
            />

            <ImageUpload
              label="Logo"
              type="organizations"
              currentImage={formData.logo}
              onUpload={(url) => setFormData(prev => ({ ...prev, logo: url }))}
            />

            <Input
              label="Website"
              name="website"
              type="url"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://example.com"
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="contact@example.com"
            />

            <Modal.Footer>
              <Button variant="ghost" onClick={handleCloseModal} disabled={saving}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={saving}>
                {editingOrg ? 'Update' : 'Create'} Organization
              </Button>
            </Modal.Footer>
          </form>
        </Modal>

        <ConfirmDialog
          isOpen={!!deleteId}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDelete}
          title="Delete Organization?"
          description="This will permanently delete the organization and all its departments. This action cannot be undone."
          confirmText="Delete"
          variant="danger"
          loading={deleting}
        />
      </div>
    </ProtectedRoute>
  );
};

export default ManageOrganizations;