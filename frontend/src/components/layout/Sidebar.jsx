import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../utils/helpers';
import { Badge } from '../common';

const Sidebar = ({ items, title }) => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] sticky top-16">
      <div className="p-6">
        {title && (
          <h2 className="text-lg font-semibold text-gray-900 mb-6">{title}</h2>
        )}

        <nav className="space-y-1">
          {items.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                  isActive
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                {item.icon && (
                  <span className={cn(isActive ? 'text-primary-600' : 'text-gray-400')}>
                    {item.icon}
                  </span>
                )}

                <span className="flex-1">{item.label}</span>

                {item.badge && (
                  <Badge
                    variant={item.badgeVariant || 'gray'}
                    size="sm"
                  >
                    {item.badge}
                  </Badge>
                )}

                {item.count !== undefined && (
                  <span className={cn(
                    'text-xs font-medium px-2 py-0.5 rounded-full',
                    isActive ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'
                  )}>
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;