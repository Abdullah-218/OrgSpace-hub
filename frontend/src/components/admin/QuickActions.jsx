import { Button } from '../common';

const QuickActions = ({ actions, title = 'Quick Actions', className = '' }) => {
  if (!actions || actions.length === 0) {
    return null;
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant || 'outline'}
            size={action.size || 'md'}
            onClick={action.onClick}
            disabled={action.disabled}
            className={`justify-start ${action.className || ''}`}
          >
            {action.icon && (
              <span className="mr-2">
                {action.icon}
              </span>
            )}
            {action.label}
            {action.badge && (
              <span className="ml-auto px-2 py-0.5 text-xs font-medium bg-primary-100 text-primary-700 rounded-full">
                {action.badge}
              </span>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;