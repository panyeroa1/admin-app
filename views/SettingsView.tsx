import React from 'react';
import { Save, User, Bell, Moon, Globe, LogOut } from 'lucide-react';
import { AppSettings } from '../types';
import { supabase } from '../lib/supabase';

interface SettingsViewProps {
  settings: AppSettings;
  updateSettings: (s: Partial<AppSettings>) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ settings, updateSettings }) => {
  
  const handleProfileChange = (field: string, value: string) => {
    updateSettings({
      profile: { ...settings.profile, [field]: value }
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
          <p className="text-gray-500 dark:text-gray-400">Manage your account and preferences.</p>
        </div>
        <button 
          onClick={handleSignOut}
          className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors font-medium text-sm"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 space-y-6">
        <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-700 pb-4">
          <User className="text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={settings.profile.name}
              onChange={e => handleProfileChange('name', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input 
              type="email" 
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={settings.profile.email}
              onChange={e => handleProfileChange('email', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
            <input 
              type="tel" 
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={settings.profile.phone}
              onChange={e => handleProfileChange('phone', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
            <input 
              type="text" 
              readOnly
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-300 cursor-not-allowed"
              value={settings.profile.role}
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 space-y-6">
        <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-700 pb-4">
          <Globe className="text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">App Preferences</h3>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Toggle dark theme</p>
          </div>
          <button 
            onClick={() => updateSettings({ darkMode: !settings.darkMode })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.darkMode ? 'bg-blue-600' : 'bg-gray-200'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.darkMode ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Email Notifications</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Receive updates via email</p>
          </div>
          <button 
            onClick={() => updateSettings({ notifyEmail: !settings.notifyEmail })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.notifyEmail ? 'bg-blue-600' : 'bg-gray-200'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.notifyEmail ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Save size={18} />
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default SettingsView;