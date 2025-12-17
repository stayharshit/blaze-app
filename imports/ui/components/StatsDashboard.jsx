import React from 'react';

const StatsDashboard = ({ stats }) => {
  const { total, completed, incomplete, highPriority } = stats || {};

  return (
    <div className="stats-section">
      <div className="stats-dashboard">
        <div className="stat-card">
          <div className="stat-value">{total || 0}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{completed || 0}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{incomplete || 0}</div>
          <div className="stat-label">Incomplete</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{highPriority || 0}</div>
          <div className="stat-label">High Priority</div>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;

