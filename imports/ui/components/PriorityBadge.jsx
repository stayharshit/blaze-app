import React from 'react';

const PriorityBadge = ({ priority }) => {
  const priorityConfig = {
    high: { label: 'High', class: 'priority-high', icon: '🔴' },
    medium: { label: 'Medium', class: 'priority-medium', icon: '🟡' },
    low: { label: 'Low', class: 'priority-low', icon: '🟢' },
  };

  const config = priorityConfig[priority] || priorityConfig.medium;

  return (
    <span className={`priority-badge ${config.class}`}>
      <span className="priority-icon">{config.icon}</span>
      <span className="priority-label">{config.label}</span>
    </span>
  );
};

export default PriorityBadge;

