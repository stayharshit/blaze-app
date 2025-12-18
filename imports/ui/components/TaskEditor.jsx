import React, { useState, useEffect } from 'react';

const TaskEditor = ({ task, onSave, onCancel }) => {
  const [text, setText] = useState(task?.text || '');
  const [priority, setPriority] = useState(task?.priority || 'medium');

  useEffect(() => {
    if (task) {
      setText(task.text || '');
      setPriority(task.priority || 'medium');
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) {
      return;
    }

    if (!onSave || typeof onSave !== 'function') {
      return;
    }

    onSave({
      text: text.trim(),
      priority,
    });
  };

  // Ensure callbacks are functions
  const handleCancel = onCancel && typeof onCancel === 'function' ? onCancel : () => { };

  return (
    <div className="task-editor-overlay" onClick={handleCancel}>
      <div className="task-editor-modal" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="task-editor-form">
          <h3>{task ? 'Edit Task' : 'New Task'}</h3>

          <div className="form-group">
            <label>Task Text</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter task description"
              autoFocus
              required
            />
          </div>

          <div className="form-group">
            <label>Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleCancel} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-save">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskEditor;

