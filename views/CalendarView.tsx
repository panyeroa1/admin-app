import React, { useState } from 'react';
import { Plus, Calendar as CalendarIcon, Clock } from 'lucide-react';
import Modal from '../components/UI/Modal';
import { CalendarEvent } from '../types';

interface CalendarViewProps {
  events: CalendarEvent[];
  addEvent: (evt: Omit<CalendarEvent, 'id'>) => void;
  deleteEvent: (id: string) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ events, addEvent, deleteEvent }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<CalendarEvent>>({
    color: 'blue'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.date && formData.startTime) {
      addEvent({
        title: formData.title,
        description: formData.description || '',
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime || '',
        color: formData.color as any || 'blue',
        duration: '1h', // simplified
        createdAt: new Date().toISOString()
      });
      setIsModalOpen(false);
      setFormData({ color: 'blue' });
    }
  };

  const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Calendar</h2>
          <p className="text-gray-500 dark:text-gray-400">Upcoming appointments and events.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-gray-900 dark:bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          Add Event
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">Upcoming Events</h3>
        <div className="space-y-4">
          {sortedEvents.map(evt => (
            <div key={evt.id} className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 border-l-4 border-blue-500">
              <div className="flex-shrink-0 flex flex-col items-center justify-center bg-white dark:bg-gray-700 rounded-lg p-2 min-w-[60px] shadow-sm">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">{new Date(evt.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                <span className="text-xl font-bold text-gray-900 dark:text-white">{new Date(evt.date).getDate()}</span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 dark:text-white">{evt.title}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{evt.description}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400 font-medium">
                  <span className="flex items-center gap-1"><Clock size={14}/> {evt.startTime} - {evt.endTime}</span>
                </div>
              </div>
              <button 
                onClick={() => deleteEvent(evt.id)}
                className="text-gray-400 hover:text-red-500 dark:hover:text-red-400"
              >
                &times;
              </button>
            </div>
          ))}
          {sortedEvents.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">No upcoming events.</p>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Event">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Event Title</label>
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
          <div className="grid grid-cols-3 gap-4">
             <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
              <input 
                required
                type="date" 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={formData.date || ''}
                onChange={e => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Time</label>
              <input 
                required
                type="time" 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={formData.startTime || ''}
                onChange={e => setFormData({...formData, startTime: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Time</label>
              <input 
                type="time" 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={formData.endTime || ''}
                onChange={e => setFormData({...formData, endTime: e.target.value})}
              />
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
              Save Event
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CalendarView;
