import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Footer, Container } from '../../components/layout';
import { Card, SearchBar, Loading, EmptyState, Badge, Button } from '../../components/common';
import organizationService from '../../services/organizationService';
import { ROUTES } from '../../utils/constants';
import { formatNumber } from '../../utils/helpers';
import toast from 'react-hot-toast';

const Organizations = () => {
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const response = await organizationService.getOrganizations({ limit: 100 });
      console.log('Organizations response:', response);
      if (response.success) {
        setOrganizations(response.data.organizations || []);
      }
    } catch (error) {
      console.error('Error fetching organizations:', error);
      toast.error(error.response?.data?.message || 'Failed to load organizations');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrgs = organizations.filter(org =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.about?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <>
        <Navbar />
        <Loading.Page text="Loading organizations..." />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <Container className="py-12 flex-1">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Organizations</h1>
          <p className="text-xl text-gray-600">
            Explore and join verified organizations from around the world
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <SearchBar
            placeholder="Search organizations..."
            value={searchTerm}
            onChange={setSearchTerm}
            className="max-w-2xl"
          />
        </div>

        {/* Organizations Grid */}
        {filteredOrgs.length === 0 ? (
          <EmptyState
            title="No organizations found"
            description={searchTerm ? "Try a different search term" : "No organizations available yet"}
            icon={
              <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
          />
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Showing {filteredOrgs.length} {filteredOrgs.length === 1 ? 'organization' : 'organizations'}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrgs.map((org) => (
                <Card
                  key={org.id}
                  hover
                  className="cursor-pointer transition-all duration-200"
                  onClick={() => navigate(ROUTES.ORGANIZATION_DETAIL(org.id))}
                >
                  {/* Logo/Cover */}
                  <div className="w-full h-32 bg-gradient-to-br from-primary-500 to-purple-500 rounded-lg mb-4 flex items-center justify-center">
                    {org.logo ? (
                      <img src={org.logo} alt={org.name} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <span className="text-4xl font-bold text-white">
                        {org.name?.charAt(0) || 'O'}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {org.name}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {org.about || 'No description available'}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>{formatNumber(org.stats?.membersCount || 0)} members</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <span>{formatNumber(org.stats?.departmentsCount || 0)} depts</span>
                    </div>
                  </div>

                  {/* Active Badge */}
                  {org.active && (
                    <div className="mt-3">
                      <Badge variant="success" size="sm">Active</Badge>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </>
        )}
      </Container>

      <Footer />
    </div>
  );
};

export default Organizations;