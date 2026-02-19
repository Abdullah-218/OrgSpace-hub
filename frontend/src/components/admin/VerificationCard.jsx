import { Avatar, Badge, Button } from '../common';
import { formatDate } from '../../utils/helpers';

const VerificationCard = ({ 
  verification, 
  onApprove, 
  onReject, 
  onViewDetails,
  loading = false,
  className = '' 
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <Avatar
          src={verification.userId?.avatar}
          name={verification.userId?.name}
          size="lg"
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
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

          {/* Details */}
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <p className="text-xs text-gray-500">Organization</p>
              <p className="text-sm font-medium text-gray-900">
                {verification.orgId?.name || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Department</p>
              <p className="text-sm font-medium text-gray-900">
                {verification.deptId?.name || 'N/A'}
              </p>
            </div>
          </div>

          {/* Message */}
          {verification.message && (
            <div className="mb-3 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700 italic">
                "{verification.message}"
              </p>
            </div>
          )}

          {/* Rejection Reason */}
          {verification.status === 'rejected' && verification.rejectionReason && (
            <div className="mb-3 p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="text-xs text-red-600 font-medium mb-1">Rejection Reason:</p>
              <p className="text-sm text-red-800">{verification.rejectionReason}</p>
            </div>
          )}

          {/* Timestamp */}
          <p className="text-xs text-gray-500 mb-4">
            Requested {formatDate(verification.createdAt, 'relative')}
          </p>

          {/* Actions */}
          {verification.status === 'pending' && (
            <div className="flex gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => onApprove(verification._id)}
                disabled={loading}
              >
                Approve
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onReject(verification._id)}
                disabled={loading}
                className="text-red-600 hover:bg-red-50"
              >
                Reject
              </Button>
              {onViewDetails && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewDetails(verification)}
                  disabled={loading}
                >
                  Details
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationCard;