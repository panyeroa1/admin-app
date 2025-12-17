import React, { useState } from 'react';
import { Plus, Search, Filter, Home, MapPin, Tag, MoreHorizontal } from 'lucide-react';
import Modal from '../components/UI/Modal';
import { Property } from '../types';

interface PropertiesViewProps {
  properties: Property[];
  addProperty: (prop: Omit<Property, 'id'>) => void;
  deleteProperty: (id: string) => void;
  updateProperty: (id: string, data: Partial<Property>) => void;
}

const PropertiesView: React.FC<PropertiesViewProps> = ({ properties, addProperty, deleteProperty, updateProperty }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<Partial<Property>>({
    status: 'active',
    type: 'apartment'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.address && formData.price) {
      addProperty({
        name: formData.name,
        address: formData.address,
        price: Number(formData.price),
        type: formData.type as any || 'apartment',
        bedrooms: formData.bedrooms ? Number(formData.bedrooms) : undefined,
        bathrooms: formData.bathrooms ? Number(formData.bathrooms) : undefined,
        size: formData.size ? Number(formData.size) : undefined,
        status: formData.status as any || 'active',
        createdAt: new Date().toISOString()
      });
      setIsModalOpen(false);
      setFormData({ status: 'active', type: 'apartment' });
    }
  };

  const filteredProps = properties.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Properties</h2>
          <p className="text-gray-500 dark:text-gray-400">Manage your property listings.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-gray-900 dark:bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          Add Property
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search properties..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
          <Filter size={18} />
          Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProps.map(prop => (
          <div key={prop.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow group">
            <div className="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center relative">
              <Home size={48} className="text-gray-400 dark:text-gray-600" />
              <div className="absolute top-4 right-4 bg-white dark:bg-gray-900 px-3 py-1 rounded-full text-xs font-semibold shadow-sm text-gray-900 dark:text-white capitalize">
                {prop.status}
              </div>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">{prop.name}</h3>
                  <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm mt-1">
                    <MapPin size={14} />
                    {prop.address}
                  </div>
                </div>
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  €{prop.price.toLocaleString()}
                </div>
              </div>
              
              <div className="flex gap-4 mt-4 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-1">
                  <span className="font-semibold">{prop.bedrooms || '-'}</span> Beds
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-semibold">{prop.bathrooms || '-'}</span> Baths
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-semibold">{prop.size || '-'}</span> m²
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                <button 
                  onClick={() => deleteProperty(prop.id)}
                  className="text-red-600 dark:text-red-400 text-sm font-medium hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Property">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Property Name</label>
            <input 
              required
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={formData.name || ''}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
            <input 
              required
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={formData.address || ''}
              onChange={e => setFormData({...formData, address: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (€)</label>
              <input 
                required
                type="number" 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={formData.price || ''}
                onChange={e => setFormData({...formData, price: Number(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value as any})}
              >
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="commercial">Commercial</option>
                <option value="land">Land</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
             <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Beds</label>
              <input 
                type="number" 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={formData.bedrooms || ''}
                onChange={e => setFormData({...formData, bedrooms: Number(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Baths</label>
              <input 
                type="number" 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={formData.bathrooms || ''}
                onChange={e => setFormData({...formData, bathrooms: Number(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Size (m²)</label>
              <input 
                type="number" 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={formData.size || ''}
                onChange={e => setFormData({...formData, size: Number(e.target.value)})}
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
              Save Property
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PropertiesView;
