import React, { useState, useEffect } from 'react';

const TaskEditor = ({ task, onSave, onCancel }) => {
  const [text, setText] = useState(task?.text || '');
  const [priority, setPriority] = useState(task?.priority || 'medium');
  const [dueDate, setDueDate] = useState(task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
  const [category, setCategory] = useState(task?.category || '');

  useEffect(() => {
    if (task) {
      setText(task.text || '');
      setPriority(task.priority || 'medium');
      setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
      setCategory(task.category || '');
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSave({
        text: text.trim(),
        priority,
        dueDate: dueDate || null,
        category: category.trim() || null,
      });
    }
  };

  return (
    <div className="task-editor-overlay" onClick={onCancel}>
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

          <div className="form-group">
            <label>Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g., Work, Personal"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn-cancel">
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

