import OrgCard from './OrgCard';
import { EmptyState, Loading } from '../common';

const OrgList = ({ 
  organizations, 
  loading = false, 
  emptyMessage = 'No organizations found',
  showActions = false,
  onEdit,
  onDelete,
  className = '' 
}) => {
  if (loading) {
    return <Loading.CardSkeleton count={6} />;
  }

  if (!organizations || organizations.length === 0) {
    return (
      <EmptyState
        title={emptyMessage}
        description="Organizations will appear here"
        icon={
          <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        }
      />
    );
  }

  return (
    <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {organizations.map((org) => (
        <OrgCard
          key={org._id}
          organization={org}
          showActions={showActions}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default OrgList;