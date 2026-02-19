import StatsCard from './StatsCard';

const StatsGrid = ({ stats, className = '' }) => {
  if (!stats || stats.length === 0) {
    return null;
  }

  return (
    <div className={`grid md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {stats.map((stat, index) => (
        <StatsCard
          key={index}
          label={stat.label}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
          trend={stat.trend}
          trendDirection={stat.trendDirection}
          onClick={stat.onClick}
        />
      ))}
    </div>
  );
};

export default StatsGrid;