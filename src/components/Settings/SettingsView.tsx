import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sun, Award, Bell, Volume2, Database, Info, Archive, Trash2, Download, Upload, Plus, TrendingUp } from 'lucide-react';
import { AppSettings, Class, BonusCategory } from '../../types';
import { cn } from '../../lib/utils';

interface SettingsViewProps {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  onReset: () => void;
  classes: Class[];
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

export function SettingsView({ settings, updateSettings, onReset, classes, onArchive, onDelete }: SettingsViewProps) {
  const [showArchived, setShowArchived] = useState(false);
  const archivedClasses = classes.filter((c) => c.isArchived);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-4xl mx-auto space-y-8 pb-20"
    >
      <header>
        <h2 className="text-3xl font-bold">Settings</h2>
        <p className="text-slate-500">Customize your experience and manage your data.</p>
      </header>

      {/* General */}
      <SettingsSection title="General" icon={<Sun size={20} className="text-orange-500" />}>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Dark Mode</p>
            <p className="text-xs text-slate-500">Switch between light and dark themes</p>
          </div>
          <button 
            onClick={() => updateSettings({ theme: settings.theme === 'light' ? 'dark' : 'light' })}
            className={cn(
              "w-12 h-6 rounded-full transition-colors relative",
              settings.theme === 'dark' ? "bg-primary" : "bg-slate-200 dark:bg-slate-800"
            )}
          >
            <div className={cn(
              "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
              settings.theme === 'dark' ? "left-7" : "left-1"
            )} />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Animations</p>
            <p className="text-xs text-slate-500">Enable smooth UI transitions</p>
          </div>
          <button 
            onClick={() => updateSettings({ animationsEnabled: !settings.animationsEnabled })}
            className={cn(
              "w-12 h-6 rounded-full transition-colors relative",
              settings.animationsEnabled ? "bg-primary" : "bg-slate-200 dark:bg-slate-800"
            )}
          >
            <div className={cn(
              "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
              settings.animationsEnabled ? "left-7" : "left-1"
            )} />
          </button>
        </div>
      </SettingsSection>

      {/* Bonus Settings */}
      <SettingsSection title="Bonus Settings" icon={<Award size={20} className="text-blue-500" />}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Default Maximum Bonus</label>
            <input 
              type="number" 
              value={settings.maxBonusLimit}
              onChange={(e) => updateSettings({ maxBonusLimit: parseInt(e.target.value) || 10 })}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">Bonus Categories</label>
              <button 
                onClick={() => {
                  const newCat: BonusCategory = {
                    id: Math.random().toString(36).substr(2, 9),
                    name: 'New Category',
                    icon: 'Award',
                    defaultAmount: 1
                  };
                  updateSettings({ bonusCategories: [...settings.bonusCategories, newCat] });
                }}
                className="p-1 hover:bg-primary/10 text-primary rounded-lg transition-colors"
                title="Add Category"
              >
                <Plus size={18} />
              </button>
            </div>
            <div className="space-y-3">
              {settings.bonusCategories.map((cat) => (
                <div key={cat.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
                    <Award size={20} className="text-primary" />
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <input 
                      type="text" 
                      value={cat.name}
                      onChange={(e) => {
                        const newCats = settings.bonusCategories.map(c => c.id === cat.id ? { ...c, name: e.target.value } : c);
                        updateSettings({ bonusCategories: newCats });
                      }}
                      className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Category Name"
                    />
                    <input 
                      type="number" 
                      value={cat.defaultAmount}
                      onChange={(e) => {
                        const newCats = settings.bonusCategories.map(c => c.id === cat.id ? { ...c, defaultAmount: parseInt(e.target.value) || 0 } : c);
                        updateSettings({ bonusCategories: newCats });
                      }}
                      className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Amount"
                    />
                  </div>
                  <button 
                    onClick={() => {
                      if (settings.bonusCategories.length > 1) {
                        const newCats = settings.bonusCategories.filter(c => c.id !== cat.id);
                        updateSettings({ bonusCategories: newCats });
                      }
                    }}
                    className="p-2 text-slate-400 hover:text-destructive transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* Notifications */}
      <SettingsSection title="Notifications" icon={<Bell size={20} className="text-purple-500" />}>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Reminders</p>
            <p className="text-xs text-slate-500">Get notified to assign bonuses</p>
          </div>
          <button 
            onClick={() => updateSettings({ notificationsEnabled: !settings.notificationsEnabled })}
            className={cn(
              "w-12 h-6 rounded-full transition-colors relative",
              settings.notificationsEnabled ? "bg-primary" : "bg-slate-200 dark:bg-slate-800"
            )}
          >
            <div className={cn(
              "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
              settings.notificationsEnabled ? "left-7" : "left-1"
            )} />
          </button>
        </div>
        {settings.notificationsEnabled && (
          <div className="pt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Reminder Time</label>
              <input 
                type="time" 
                value={settings.reminderTime}
                onChange={(e) => updateSettings({ reminderTime: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Smart Reminders</p>
                <p className="text-xs text-slate-500">Only remind if no bonuses given today</p>
              </div>
              <button 
                onClick={() => updateSettings({ smartReminders: !settings.smartReminders })}
                className={cn(
                  "w-12 h-6 rounded-full transition-colors relative",
                  settings.smartReminders ? "bg-primary" : "bg-slate-200 dark:bg-slate-800"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                  settings.smartReminders ? "left-7" : "left-1"
                )} />
              </button>
            </div>
          </div>
        )}
      </SettingsSection>

      {/* Sound Settings */}
      <SettingsSection title="Sound Settings" icon={<Volume2 size={20} className="text-pink-500" />}>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Sound Effects</p>
            <p className="text-xs text-slate-500">Play sound on max bonus</p>
          </div>
          <button 
            onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
            className={cn(
              "w-12 h-6 rounded-full transition-colors relative",
              settings.soundEnabled ? "bg-primary" : "bg-slate-200 dark:bg-slate-800"
            )}
          >
            <div className={cn(
              "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
              settings.soundEnabled ? "left-7" : "left-1"
            )} />
          </button>
        </div>
        {settings.soundEnabled && (
          <div className="pt-4">
            <label className="block text-sm font-medium mb-1">Sound Type</label>
            <select 
              value={settings.soundType}
              onChange={(e) => updateSettings({ soundType: e.target.value as any })}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="ding">Ding</option>
              <option value="bell">Bell</option>
              <option value="chime">Chime</option>
            </select>
          </div>
        )}
      </SettingsSection>

      {/* Data Management */}
      <SettingsSection title="Data Management" icon={<Database size={20} className="text-orange-500" />}>
        <div className="space-y-3">
          <button 
            onClick={() => setShowArchived(true)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Archive size={18} className="text-slate-500" />
              <span className="font-medium">View Archived Classes</span>
            </div>
            <span className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full">{archivedClasses.length}</span>
          </button>
          <button 
            onClick={onReset}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/5 transition-colors"
          >
            <Trash2 size={18} />
            <span className="font-medium">Reset All Data</span>
          </button>
        </div>
      </SettingsSection>

      {/* Backup & Export */}
      <SettingsSection title="Backup & Export" icon={<Download size={20} className="text-green-500" />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <Download size={18} />
            <span className="font-medium">Export CSV</span>
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <Download size={18} />
            <span className="font-medium">Export PDF</span>
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
            <Upload size={18} />
            <span className="font-medium">Backup Data</span>
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <Download size={18} />
            <span className="font-medium">Restore Backup</span>
          </button>
        </div>
      </SettingsSection>

      {/* About */}
      <SettingsSection title="About" icon={<Info size={20} className="text-slate-500" />}>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-500">App Name</span>
            <span className="font-medium">BonusTracker</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Version</span>
            <span className="font-medium">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Developer</span>
            <span className="font-medium">Teacher's Assistant Team</span>
          </div>
          <p className="text-sm text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
            A comprehensive tool designed to help educators track and reward student participation and achievement in real-time.
          </p>
        </div>
      </SettingsSection>

      {/* Archived Classes Modal */}
      {showArchived && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Archived Classes</h3>
              <button onClick={() => setShowArchived(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                <Plus className="rotate-45" size={24} />
              </button>
            </div>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {archivedClasses.length > 0 ? archivedClasses.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div>
                    <p className="font-bold">{c.name}</p>
                    <p className="text-xs text-slate-500">{c.courseName}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => onArchive(c.id)}
                      className="p-2 hover:bg-primary/10 text-primary rounded-lg"
                      title="Restore"
                    >
                      <TrendingUp size={18} />
                    </button>
                    <button 
                      onClick={() => { if(confirm('Delete permanently?')) onDelete(c.id); }}
                      className="p-2 hover:bg-destructive/10 text-destructive rounded-lg"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              )) : (
                <p className="text-center py-10 text-slate-500">No archived classes.</p>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

function SettingsSection({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex items-center gap-3">
        {icon}
        <h3 className="font-bold">{title}</h3>
      </div>
      <div className="p-6 space-y-6">
        {children}
      </div>
    </div>
  );
}
