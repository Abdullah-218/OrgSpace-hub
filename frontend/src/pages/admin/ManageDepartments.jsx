import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navbar, Footer, Container, Sidebar, ProtectedRoute } from '../../components/layout';
import { Card, Button, SearchBar, Loading, EmptyState, Modal, Input, Textarea, ConfirmDialog, Badge } from '../../components/common';
import { ROUTES, ROLES } from '../../utils/constants';
import { formatNumber } from '../../utils/helpers';
import toast from 'react-hot-toast';

const ManageDepartments = () => {
  const { user } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/departments/organization/${user.orgId._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('blog_platform_token')}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setDepartments(data.data.departments);
      }
    } catch (error) {
      toast.error('Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrors({ name: 'Department name is required' });
      return;
    }

    setSaving(true);
    try {
      const url = editingDept
        ? `${import.meta.env.VITE_API_URL}/departments/${editingDept._id}`
        : `${import.meta.env.VITE_API_URL}/departments`;

      const response = await fetch(url, {
        method: editingDept ? 'PATCH' : 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('blog_platform_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          orgId: user.orgId._id,
        }),
      });

      if (response.ok) {
        toast.success(editingDept ? 'Department updated!' : 'Department created!');
        handleCloseModal();
        fetchDepartments();
      }
    } catch (error) {
      toast.error('Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/departments/${deleteId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('blog_platform_token')}`,
          },
        }
      );

      if (response.ok) {
        setDepartments(departments.filter(d => d._id !== deleteId));
        toast.success('Department deleted');
        setDeleteId(null);
      }
    } catch (error) {
      toast.error('Failed to delete department');
    }
  };

  const handleEdit = (dept) => {
    setEditingDept(dept);
    setFormData({ name: dept.name, description: dept.description || '' });
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingDept(null);
    setFormData({ name: '', description: '' });
    setErrors({});
  };

  const filteredDepts = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sidebarItems = [
    {
      label: 'Dashboard',
      path: ROUTES.ORG_ADMIN_DASHBOARD,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      label: 'Departments',
      path: ROUTES.MANAGE_DEPTS,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
  ];

  return (
    <ProtectedRoute requiredMinRole={ROLES.ORG_ADMIN}>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />

        <div className="flex flex-1">
          <Sidebar items={sidebarItems} title="Organization Admin" />

          <div className="flex-1">
            <Container className="py-12">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-4xl font-bold text-gray-900">Manage Departments</h1>
                  <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Department
                  </Button>
                </div>
                <p className="text-xl text-gray-600">Manage departments in {user?.orgId?.name}</p>
              </div>

              <div className="mb-6">
                <SearchBar
                  placeholder="Search departments..."
                  value={searchTerm}
                  onChange={setSearchTerm}
                  className="max-w-2xl"
                />
              </div>

              {loading ? (
                <Loading.CardSkeleton count={6} />
              ) : filteredDepts.length === 0 ? (
                <EmptyState
                  title="No departments found"
                  description={searchTerm ? "Try a different search term" : "Create your first department"}
                  action={
                    !searchTerm && (
                      <Button onClick={() => setShowCreateModal(true)}>
                        Create Department
                      </Button>
                    )
                  }
                />
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDepts.map((dept) => (
                    <Card key={dept._id} hover>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{dept.name}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {dept.description || 'No description'}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <span>{formatNumber(dept.memberCount || 0)} members</span>
                        <span>·</span>
                        <span>{formatNumber(dept.blogCount || 0)} blogs</span>
                      </div>
                      
                      <div className="flex gap-2 pt-4 border-t border-gray-200">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(dept)} className="flex-1">
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteId(dept._id)}
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
          title={editingDept ? 'Edit Department' : 'Create Department'}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Department Name"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={errors.name}
              required
            />

            <Textarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
            />

            <Modal.Footer>
              <Button variant="ghost" onClick={handleCloseModal} disabled={saving}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={saving}>
                {editingDept ? 'Update' : 'Create'} Department
              </Button>
            </Modal.Footer>
          </form>
        </Modal>

        <ConfirmDialog
          isOpen={!!deleteId}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDelete}
          title="Delete Department?"
          description="This will permanently delete the department. This action cannot be undone."
          confirmText="Delete"
          variant="danger"
        />
      </div>
    </ProtectedRoute>
  );
};

export default ManageDepartments;