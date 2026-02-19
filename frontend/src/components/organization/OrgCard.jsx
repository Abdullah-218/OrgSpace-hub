import { useNavigate } from 'react-router-dom';
import { Badge } from '../common';
import { ROUTES } from '../../utils/constants';
import { formatNumber } from '../../utils/helpers';

const OrgCard = ({ organization, showActions = false, onEdit, onDelete, className = '' }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!showActions) {
      navigate(ROUTES.ORGANIZATION_DETAIL(organization._id));
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${!showActions ? 'cursor-pointer hover:shadow-md' : ''} transition-all duration-200 ${className}`}
    >
      {/* Logo/Cover */}
      <div className="w-full h-32 bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center overflow-hidden">
        {organization.logo ? (
          <img
            src={organization.logo}
            alt={organization.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-4xl font-bold text-white">
            {organization.name.charAt(0)}
          </span>
        )}
      </div>

      <div className="p-6">
        {/* Name & Status */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-semibold text-gray-900 flex-1">
            {organization.name}
          </h3>
          <Badge variant={organization.active ? 'success' : 'gray'}>
            {organization.active ? 'Active' : 'Inactive'}
          </Badge>
        </div>

        {/* About */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {organization.about || 'No description available'}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>{formatNumber(organization.memberCount || 0)} members</span>
          </div>
          <span>·</span>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span>{formatNumber(organization.departmentCount || 0)} depts</span>
          </div>
          {organization.blogCount !== undefined && (
            <>
              <span>·</span>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>{formatNumber(organization.blogCount)} blogs</span>
              </div>
            </>
          )}
        </div>

        {/* Contact Info */}
        {(organization.website || organization.email) && (
          <div className="pt-4 border-t border-gray-200 space-y-2 text-sm">
            {organization.website && (
              <a
                href={organization.website}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <span className="truncate">Website</span>
              </a>
            )}
            {organization.email && (
              <a
                href={`mailto:${organization.email}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="truncate">Contact</span>
              </a>
            )}
          </div>
        )}

        {/* Actions */}
        {showActions && (onEdit || onDelete) && (
          <div className="flex gap-2 pt-4 border-t border-gray-200 mt-4">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(organization);
                }}
                className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(organization._id);
                }}
                className="px-3 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrgCard;