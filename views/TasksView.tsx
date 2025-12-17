import React, { useState } from 'react';
import { Plus, CheckCircle, Circle, Calendar, Flag } from 'lucide-react';
import Modal from '../components/UI/Modal';
import { Task } from '../types';

interface TasksViewProps {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  toggleTaskComplete: (id: string) => void;
  deleteTask: (id: string) => void;
}

const TasksView: React.FC<TasksViewProps> = ({ tasks, addTask, toggleTaskComplete, deleteTask }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Task>>({
    priority: 'medium',
    category: 'general'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.dueDate) {
      addTask({
        title: formData.title,
        description: formData.description || '',
        dueDate: formData.dueDate,
        priority: formData.priority as any || 'medium',
        category: formData.category || 'general',
        completed: false,
        createdAt: new Date().toISOString()
      });
      setIsModalOpen(false);
      setFormData({ priority: 'medium', category: 'general' });
    }
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'urgent': return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      case 'high': return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20';
      case 'medium': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-700/50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tasks</h2>
          <p className="text-gray-500 dark:text-gray-400">Manage your daily activities.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-gray-900 dark:bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          Add Task
        </button>
      </div>

      <div className="space-y-4">
        {tasks.map(task => (
          <div key={task.id} className={`bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border ${task.completed ? 'border-gray-100 dark:border-gray-700 opacity-60' : 'border-gray-200 dark:border-gray-600'} transition-all flex items-center gap-4`}>
            <button 
              onClick={() => toggleTaskComplete(task.id)}
              className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                task.completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 dark:border-gray-500 hover:border-green-500'
              }`}
            >
              {task.completed && <CheckCircle size={16} />}
            </button>
            
            <div className="flex-1">
              <h3 className={`font-medium text-gray-900 dark:text-white ${task.completed ? 'line-through' : ''}`}>
                {task.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{task.description}</p>
            </div>

            <div className="flex items-center gap-3">
              <span className={`px-2 py-1 rounded text-xs font-semibold capitalize ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
              <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                <Calendar size={14} className="mr-1" />
                {new Date(task.dueDate).toLocaleDateString()}
              </div>
              <button 
                onClick={() => deleteTask(task.id)}
                className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors px-2"
              >
                &times;
              </button>
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="text-center py-12 text-gray-400 dark:text-gray-500">
            No tasks found. Create one to stay organized.
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Task">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Task Title</label>
            <input 
              required
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={formData.title || ''}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea 
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={formData.description || ''}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
              <input 
                required
                type="date" 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={formData.dueDate || ''}
                onChange={e => setFormData({...formData, dueDate: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={formData.priority}
                onChange={e => setFormData({...formData, priority: e.target.value as any})}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Save Task
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TasksView;
