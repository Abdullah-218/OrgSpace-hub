import DeptCard from './DeptCard';
import { EmptyState, Loading } from '../common';

const DeptList = ({ 
  departments, 
  loading = false, 
  emptyMessage = 'No departments found',
  showActions = false,
  onEdit,
  onDelete,
  className = '' 
}) => {
  if (loading) {
    return <Loading.CardSkeleton count={6} />;
  }

  if (!departments || departments.length === 0) {
    return (
      <EmptyState
        title={emptyMessage}
        description="Departments will appear here"
        icon={
          <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        }
      />
    );
  }

  return (
    <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {departments.map((dept) => (
        <DeptCard
          key={dept._id}
          department={dept}
          showActions={showActions}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default DeptList;