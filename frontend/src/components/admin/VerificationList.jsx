import VerificationCard from './VerificationCard';
import { EmptyState, Loading } from '../common';

const VerificationList = ({ 
  verifications, 
  loading = false,
  onApprove,
  onReject,
  onViewDetails,
  emptyMessage = 'No verification requests',
  className = '' 
}) => {
  if (loading) {
    return <Loading.CardSkeleton count={5} />;
  }

  if (!verifications || verifications.length === 0) {
    return (
      <EmptyState
        title={emptyMessage}
        description="Verification requests will appear here"
        icon={
          <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {verifications.map((verification) => (
        <VerificationCard
          key={verification._id}
          verification={verification}
          onApprove={onApprove}
          onReject={onReject}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};

export default VerificationList;