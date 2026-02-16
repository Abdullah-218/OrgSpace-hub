platform/frontend/src/pages/admin/VerificationManagement.jsx << 'ENDOFFILE'
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navbar, Footer, Container, Sidebar, ProtectedRoute } from '../../components/layout';
import { Card, Button, Badge, Loading, EmptyState, Avatar, Modal, Textarea, SearchBar } from '../../components/common';
import { ROUTES, ROLES } from '../../utils/constants';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const VerificationManagement = () => {
  const { user } = useAuth();
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [rejectId, setRejectId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchVerifications();
  }, [filter]);

  const fetchVerifications = async () => {
    setLoading(true);
    try {
      let endpoint = '';
      if (user.role === ROLES.SUPER_ADMIN) {
        endpoint = '/admin/super/verifications';
      } else if (user.role === ROLES.ORG_ADMIN) {
        endpoint = '/admin/org/verifications';
      } else if (user.role === ROLES.DEPT_ADMIN) {
        endpoint = '/admin/dept/verifications';
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}${endpoint}?status=${filter}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('blog_platform_token')}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setVerifications(data.data.verifications);
      }
    } catch (error) {
      toast.error('Failed to load verifications');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setProcessing(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/verifications/${id}/approve`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('blog_platform_token')}`,
          },
        }
      );

      if (response.ok) {
        toast.success('Verification approved!');
        fetchVerifications();
      }
    } catch (error) {
      toast.error('Failed to approve verification');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a reason');
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/verifications/${rejectId}/reject`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('blog_platform_token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ reason: rejectReason }),
        }
      );

      if (response.ok) {
        toast.success('Verification rejected');
        setRejectId(null);
        setRejectReason('');
        fetchVerifications();
      }
    } catch (error) {
      toast.error('Failed to reject verification');
    } finally {
      setProcessing(false);
    }
  };

  const filteredVerifications = verifications.filter(v =>
    v.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sidebarItems = [
    {
      label: 'Dashboard',
      path: user.role === ROLES.SUPER_ADMIN ? ROUTES.SUPER_ADMIN_DASHBOARD :
            user.role === ROLES.ORG_ADMIN ? ROUTES.ORG_ADMIN_DASHBOARD :
            ROUTES.DEPT_ADMIN_DASHBOARD,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      label: 'Verifications',
      path: ROUTES.MANAGE_VERIFICATIONS,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <ProtectedRoute requiredMinRole={ROLES.DEPT_ADMIN}>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />

        <div className="flex flex-1">
          <Sidebar items={sidebarItems} title={`${user.role === ROLES.SUPER_ADMIN ? 'Super' : user.role === ROLES.ORG_ADMIN ? 'Organization' : 'Department'} Admin`} />

          <div className="flex-1">
            <Container className="py-12">
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Verification Management</h1>
                <p className="text-xl text-gray-600">Review and manage verification requests</p>
              </div>

              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <SearchBar
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={setSearchTerm}
                  className="flex-1"
                />

                <div className="flex gap-2">
                  <Button
                    variant={filter === 'pending' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setFilter('pending')}
                  >
                    Pending
                  </Button>
                  <Button
                    variant={filter === 'approved' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setFilter('approved')}
                  >
                    Approved
                  </Button>
                  <Button
                    variant={filter === 'rejected' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setFilter('rejected')}
                  >
                    Rejected
                  </Button>
                </div>
              </div>

              {loading ? (
                <Loading.CardSkeleton count={5} />
              ) : filteredVerifications.length === 0 ? (
                <EmptyState
                  title="No verifications found"
                  description={searchTerm ? "Try a different search term" : `No ${filter} verification requests`}
                />
              ) : (
                <div className="space-y-4">
                  {filteredVerifications.map((verification) => (
                    <Card key={verification._id}>
                      <div className="flex items-start gap-4">
                        <Avatar
                          src={verification.userId?.avatar}
                          name={verification.userId?.name}
                          size="lg"
                        />

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {verification.userId?.name}
                              </h3>
                              <p className="text-sm text-gray-600">{verification.userId?.email}</p>
                            </div>
                            <Badge
                              variant={
                                verification.status === 'pending' ? 'warning' :
                                verification.status === 'approved' ? 'success' : 'error'
                              }
                            >
                              {verification.status}
                            </Badge>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 mb-3">
                            <div>
                              <p className="text-sm text-gray-600">Organization</p>
                              <p className="font-medium text-gray-900">{verification.orgId?.name}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Department</p>
                              <p className="font-medium text-gray-900">{verification.deptId?.name}</p>
                            </div>
                          </div>

                          {verification.message && (
                            <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-700 italic">"{verification.message}"</p>
                            </div>
                          )}

                          <p className="text-xs text-gray-500">
                            Requested {formatDate(verification.createdAt, 'relative')}
                          </p>

                          {verification.status === 'pending' && (
                            <div className="flex gap-2 mt-4">
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleApprove(verification._id)}
                                disabled={processing}
                              >
                                Approve
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setRejectId(verification._id)}
                                className="text-red-600 hover:bg-red-50"
                                disabled={processing}
                              >
                                Reject
                              </Button>
                            </div>
                          )}

                          {verification.status === 'rejected' && verification.rejectionReason && (
                            <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                              <p className="text-sm text-red-800">
                                <strong>Rejection Reason:</strong> {verification.rejectionReason}
                              </p>
                            </div>
                          )}
                        </div>
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
          isOpen={!!rejectId}
          onClose={() => {
            setRejectId(null);
            setRejectReason('');
          }}
          title="Reject Verification"
        >
          <div className="space-y-4">
            <p className="text-gray-600">Please provide a reason for rejecting this verification request.</p>

            <Textarea
              label="Rejection Reason"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
              required
              placeholder="Explain why this verification cannot be approved..."
            />

            <Modal.Footer>
              <Button
                variant="ghost"
                onClick={() => {
                  setRejectId(null);
                  setRejectReason('');
                }}
                disabled={processing}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleReject}
                loading={processing}
              >
                Reject Request
              </Button>
            </Modal.Footer>
          </div>
        </Modal>
      </div>
    </ProtectedRoute>
  );
};

export default VerificationManagement;