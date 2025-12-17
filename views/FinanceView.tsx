import React, { useState } from 'react';
import { Plus, DollarSign, TrendingUp, TrendingDown, FileText } from 'lucide-react';
import Modal from '../components/UI/Modal';
import { Transaction } from '../types';

interface FinanceViewProps {
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
}

const FinanceView: React.FC<FinanceViewProps> = ({ transactions, addTransaction, deleteTransaction }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Transaction>>({
    type: 'income',
    method: 'bank'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.description && formData.amount && formData.date) {
      addTransaction({
        date: formData.date,
        description: formData.description,
        type: formData.type as any || 'income',
        category: formData.category || 'General',
        amount: Number(formData.amount),
        method: formData.method || 'bank',
        createdAt: new Date().toISOString()
      });
      setIsModalOpen(false);
      setFormData({ type: 'income', method: 'bank' });
    }
  };

  const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Finance</h2>
          <p className="text-gray-500 dark:text-gray-400">Track income and expenses.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-gray-900 dark:bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          Add Transaction
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
           <div className="flex justify-between items-start">
             <div>
               <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Income</p>
               <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">€{income.toLocaleString()}</h3>
             </div>
             <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-lg">
               <TrendingUp size={24} />
             </div>
           </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
           <div className="flex justify-between items-start">
             <div>
               <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Expenses</p>
               <h3 className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">€{expense.toLocaleString()}</h3>
             </div>
             <div className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg">
               <TrendingDown size={24} />
             </div>
           </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
           <div className="flex justify-between items-start">
             <div>
               <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Net Profit</p>
               <h3 className={`text-2xl font-bold mt-1 ${(income - expense) >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-500'}`}>
                 €{(income - expense).toLocaleString()}
               </h3>
             </div>
             <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
               <DollarSign size={24} />
             </div>
           </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700 text-xs uppercase text-gray-500 dark:text-gray-400 font-semibold">
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {transactions.map(tx => (
                <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{new Date(tx.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{tx.description}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                      {tx.category}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-right font-bold ${tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                    {tx.type === 'income' ? '+' : '-'}€{tx.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => deleteTransaction(tx.id)}
                      className="text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                    >
                      <span className="sr-only">Delete</span>
                      &times;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Transaction">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value as any})}
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <input 
              required
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={formData.description || ''}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount (€)</label>
              <input 
                required
                type="number" 
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={formData.amount || ''}
                onChange={e => setFormData({...formData, amount: Number(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <input 
                required
                type="text" 
                placeholder="e.g. Sales, Marketing"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={formData.category || ''}
                onChange={e => setFormData({...formData, category: e.target.value})}
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
              Save Transaction
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FinanceView;
