import React, { useState, useEffect } from 'react';
import { Menu, Search, Bell, Loader2 } from 'lucide-react';
import { Session } from '@supabase/supabase-js';
import Sidebar from './components/Layout/Sidebar';
import CallWidget from './components/UI/CallWidget';
import { supabase } from './lib/supabase';
import AuthView from './views/AuthView';
import { 
  Lead, Message, Property, Task, CalendarEvent, Transaction, AppSettings, ViewState 
} from './types';

// Views
import DashboardView from './views/DashboardView';
import InboxView from './views/InboxView';
import LeadsView from './views/LeadsView';
import PropertiesView from './views/PropertiesView';
import TasksView from './views/TasksView';
import CalendarView from './views/CalendarView';
import FinanceView from './views/FinanceView';
import ReportsView from './views/ReportsView';
import SettingsView from './views/SettingsView';

// Default Settings
const defaultSettings: AppSettings = {
  profile: {
    name: 'Laurent De Wilde',
    email: 'laurent@eburon.com',
    phone: '+1 (555) 123-4567',
    role: 'Broker'
  },
  notifyEmail: true,
  notifyPush: true,
  notifySms: false,
  darkMode: false,
  language: 'en',
  timezone: 'UTC'
};

const App: React.FC = () => {
  // --- Auth State ---
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // --- App State ---
  const [leads, setLeads] = useState<Lead[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [dataLoading, setDataLoading] = useState(false);

  // --- UI State ---
  const [activeView, setActiveView] = useState<ViewState>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // --- Auth Initialization ---
  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        // If user logs in (or was already logged in), fetch data
        fetchData();
        // Update profile in settings if available
        if (session.user) {
          setSettings(prev => ({
            ...prev,
            profile: {
              ...prev.profile,
              email: session.user.email || prev.profile.email,
              name: session.user.user_metadata.full_name || prev.profile.name
            }
          }));
        }
      } else {
        // Clear data on logout
        setLeads([]);
        setProperties([]);
        setTasks([]);
        setMessages([]);
        setTransactions([]);
        setEvents([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // --- Data Fetching ---
  const fetchData = async () => {
    setDataLoading(true);
    try {
      const [
        { data: leadsData },
        { data: propsData },
        { data: tasksData },
        { data: msgData },
        { data: eventsData },
        { data: txData }
      ] = await Promise.all([
        supabase.from('leads').select('*').order('created_at', { ascending: false }),
        supabase.from('properties').select('*').order('created_at', { ascending: false }),
        supabase.from('tasks').select('*').order('created_at', { ascending: false }),
        supabase.from('messages').select('*').order('created_at', { ascending: false }),
        supabase.from('events').select('*').order('created_at', { ascending: false }),
        supabase.from('transactions').select('*').order('created_at', { ascending: false })
      ]);

      if (leadsData) setLeads(leadsData);
      if (propsData) setProperties(propsData);
      if (tasksData) setTasks(tasksData);
      if (msgData) setMessages(msgData);
      if (eventsData) setEvents(eventsData);
      if (txData) setTransactions(txData);

      // Settings are local for now
      const storedSettings = localStorage.getItem('eburon_settings');
      if (storedSettings) setSettings(JSON.parse(storedSettings));

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setDataLoading(false);
    }
  };

  // Sync settings to local storage when changed
  useEffect(() => {
    localStorage.setItem('eburon_settings', JSON.stringify(settings));
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  // --- CRUD Actions ---

  // Helper to handle optimistic updates and DB calls
  const handleAction = async <T extends { id: string }>(
    table: string, 
    action: 'insert' | 'update' | 'delete', 
    data: any, 
    setState: React.Dispatch<React.SetStateAction<T[]>>
  ) => {
    if (!session) return; // Prevent actions if not logged in

    try {
      if (action === 'insert') {
        const { data: newItem, error } = await supabase.from(table).insert([data]).select().single();
        if (error) throw error;
        if (newItem) setState(prev => [newItem, ...prev]);
      } 
      else if (action === 'update') {
        const { id, ...updates } = data;
        const { error } = await supabase.from(table).update(updates).eq('id', id);
        if (error) throw error;
        setState(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
      } 
      else if (action === 'delete') {
        const { error } = await supabase.from(table).delete().eq('id', data);
        if (error) throw error;
        setState(prev => prev.filter(item => item.id !== data));
      }
    } catch (err) {
      console.error(`Error performing ${action} on ${table}:`, err);
    }
  };

  const addLead = (data: Omit<Lead, 'id'>) => handleAction('leads', 'insert', data, setLeads);
  const updateLead = (id: string, data: Partial<Lead>) => handleAction('leads', 'update', { id, ...data }, setLeads);
  const deleteLead = (id: string) => handleAction('leads', 'delete', id, setLeads);

  const addProperty = (data: Omit<Property, 'id'>) => handleAction('properties', 'insert', data, setProperties);
  const updateProperty = (id: string, data: Partial<Property>) => handleAction('properties', 'update', { id, ...data }, setProperties);
  const deleteProperty = (id: string) => handleAction('properties', 'delete', id, setProperties);

  const addTask = (data: Omit<Task, 'id'>) => handleAction('tasks', 'insert', data, setTasks);
  const toggleTaskComplete = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const updates = { completed: !task.completed, completedAt: !task.completed ? new Date().toISOString() : null };
    await handleAction('tasks', 'update', { id, ...updates }, setTasks);
  };
  const deleteTask = (id: string) => handleAction('tasks', 'delete', id, setTasks);

  const addEvent = (data: Omit<CalendarEvent, 'id'>) => handleAction('events', 'insert', data, setEvents);
  const deleteEvent = (id: string) => handleAction('events', 'delete', id, setEvents);

  const addTransaction = (data: Omit<Transaction, 'id'>) => handleAction('transactions', 'insert', data, setTransactions);
  const deleteTransaction = (id: string) => handleAction('transactions', 'delete', id, setTransactions);

  const addMessage = (data: Omit<Message, 'id'>) => handleAction('messages', 'insert', data, setMessages);
  const markMessageRead = (id: string) => handleAction('messages', 'update', { id, read: true }, setMessages);
  const deleteMessage = (id: string) => handleAction('messages', 'delete', id, setMessages);

  const updateSettings = (newSettings: Partial<AppSettings>) => setSettings(prev => ({ ...prev, ...newSettings }));

  // --- Loading States ---
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  // --- Auth Gate ---
  if (!session) {
    return <AuthView />;
  }

  // --- Render Helpers ---
  const renderView = () => {
    if (dataLoading && leads.length === 0 && properties.length === 0) {
      return (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="animate-spin text-blue-600" size={48} />
        </div>
      );
    }

    const props = {
      leads, messages, properties, tasks, events, transactions, settings,
      addLead, updateLead, deleteLead,
      addProperty, updateProperty, deleteProperty,
      addTask, toggleTaskComplete, deleteTask,
      addEvent, deleteEvent,
      addTransaction, deleteTransaction,
      addMessage, markMessageRead, deleteMessage,
      updateSettings
    };

    switch (activeView) {
      case 'dashboard': return <DashboardView {...props} setActiveView={setActiveView} />;
      case 'inbox': return <InboxView {...props} />;
      case 'leads': return <LeadsView {...props} />;
      case 'properties': return <PropertiesView {...props} />;
      case 'tasks': return <TasksView {...props} />;
      case 'calendar': return <CalendarView {...props} />;
      case 'finance': return <FinanceView {...props} />;
      case 'reports': return <ReportsView {...props} />;
      case 'settings': return <SettingsView {...props} />;
      default: return <DashboardView {...props} setActiveView={setActiveView} />;
    }
  };

  const pageTitle = activeView.charAt(0).toUpperCase() + activeView.slice(1);

  return (
    <div className={`flex h-screen bg-gray-50 ${settings.darkMode ? 'dark' : ''}`}>
      <Sidebar 
        activeView={activeView} 
        onChangeView={setActiveView}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        badges={{
          inbox: messages.filter(m => !m.read).length,
          leads: leads.length,
          properties: properties.length,
          tasks: tasks.filter(t => !t.completed).length,
          calendar: events.filter(e => new Date(e.date) >= new Date()).length
        }}
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden lg:ml-[260px] transition-all duration-300">
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 lg:px-8 z-20 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300"
            >
              <Menu size={24} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white capitalize">{pageTitle}</h1>
              <p className="hidden md:block text-sm text-gray-500 dark:text-gray-400">Welcome back, {settings.profile.name.split(' ')[0]}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 text-gray-900 dark:text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="relative cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg group">
              <Bell size={20} className="text-gray-600 dark:text-gray-300" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-gray-800"></span>
            </div>

            <div className="flex items-center gap-3 pl-3 border-l border-gray-200 dark:border-gray-700 cursor-pointer" onClick={() => setActiveView('settings')}>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-100 to-emerald-100 border-2 border-white dark:border-gray-600 shadow-sm flex items-center justify-center text-emerald-700 font-semibold text-sm">
                {settings.profile.name.split(' ').map(n => n[0]).join('').substring(0,2)}
              </div>
              <div className="hidden lg:block text-right">
                <div className="text-sm font-semibold text-gray-900 dark:text-white">{settings.profile.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{settings.profile.role}</div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto h-full">
            {renderView()}
          </div>
        </div>
      </main>
      
      <CallWidget />
    </div>
  );
};

export default App;