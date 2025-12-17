import React, { useState } from 'react';
import { Mail, Star, Trash2, Send } from 'lucide-react';
import Modal from '../components/UI/Modal';
import { Message } from '../types';

interface InboxViewProps {
  messages: Message[];
  addMessage: (msg: Omit<Message, 'id'>) => void;
  markMessageRead: (id: string) => void;
  deleteMessage: (id: string) => void;
}

const InboxView: React.FC<InboxViewProps> = ({ messages, addMessage, markMessageRead, deleteMessage }) => {
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Message>>({});

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email && formData.subject && formData.body) {
      addMessage({
        sender: 'Me', // Assuming sent by current user
        email: formData.email,
        subject: formData.subject,
        body: formData.body,
        date: new Date().toISOString(),
        read: true,
        starred: false
      });
      setIsComposeOpen(false);
      setFormData({});
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Inbox</h2>
          <p className="text-gray-500 dark:text-gray-400">Communication center.</p>
        </div>
        <button 
          onClick={() => setIsComposeOpen(true)}
          className="flex items-center gap-2 bg-gray-900 dark:bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-blue-700 transition-colors"
        >
          <Send size={18} />
          Compose
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {messages.map(msg => (
            <div 
              key={msg.id} 
              onClick={() => markMessageRead(msg.id)}
              className={`p-4 flex items-start gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors ${!msg.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
            >
              <div className="flex-shrink-0 mt-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${!msg.read ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>
                  {msg.sender.charAt(0)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                  <h3 className={`text-sm font-semibold truncate ${!msg.read ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                    {msg.sender}
                  </h3>
                  <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                    {new Date(msg.date).toLocaleDateString()}
                  </span>
                </div>
                <p className={`text-sm truncate ${!msg.read ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                  {msg.subject}
                </p>
                <p className="text-xs text-gray-400 mt-1 line-clamp-1">{msg.body}</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); deleteMessage(msg.id); }}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {messages.length === 0 && (
             <div className="p-8 text-center text-gray-400 dark:text-gray-500">
               No messages yet.
             </div>
          )}
        </div>
      </div>

      <Modal isOpen={isComposeOpen} onClose={() => setIsComposeOpen(false)} title="Compose Message">
        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">To (Email)</label>
            <input 
              required
              type="email" 
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={formData.email || ''}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
            <input 
              required
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={formData.subject || ''}
              onChange={e => setFormData({...formData, subject: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
            <textarea 
              required
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={formData.body || ''}
              onChange={e => setFormData({...formData, body: e.target.value})}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
             <button 
              type="button" 
              onClick={() => setIsComposeOpen(false)}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              Discard
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Send Message
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default InboxView;
