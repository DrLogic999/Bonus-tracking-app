/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Settings as SettingsIcon, 
  LogOut, 
  Plus, 
  Search, 
  Filter, 
  TrendingUp, 
  Users, 
  Award, 
  History,
  Bell,
  Volume2,
  Database,
  Info,
  ChevronRight,
  MoreVertical,
  Trash2,
  Archive,
  Download,
  Upload,
  Moon,
  Sun,
  CheckCircle2,
  AlertCircle,
  X,
  Smile,
  Home,
  Zap
} from 'lucide-react';
import { AppData, AppSettings, Class, Student, BonusCategory, BonusRecord } from './types';
import { loadData, saveData, DEFAULT_SETTINGS } from './lib/storage';
import { cn } from './lib/utils';
import { AuthView } from './components/Auth/AuthView';
import { DashboardView } from './components/Dashboard/DashboardView';
import { ClassesView } from './components/Classes/ClassesView';
import { ClassDetailView } from './components/Classes/ClassDetailView';
import { SettingsView } from './components/Settings/SettingsView';
import { NavItem, MobileNavItem } from './components/Navigation';

type View = 'dashboard' | 'classes' | 'class-detail' | 'settings' | 'auth';

export default function App() {
  const [data, setData] = useState<AppData>(loadData());
  const [currentView, setCurrentView] = useState<View>(data.user?.isLoggedIn ? 'dashboard' : 'auth');
  const [showSplash, setShowSplash] = useState(true);

  // Load data on mount
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Persist data on change
  useEffect(() => {
    saveData(data);
    // Apply theme
    if (data.settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [data]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setData(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings }
    }));
  };

  const login = (name: string) => {
    setData(prev => ({
      ...prev,
      user: { name, isLoggedIn: true }
    }));
    setCurrentView('dashboard');
  };

  const logout = () => {
    setData(prev => ({
      ...prev,
      user: null
    }));
    setCurrentView('auth');
  };

  const addClass = (name: string, courseName: string) => {
    const newClass: Class = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      courseName,
      students: [],
      isArchived: false,
      createdAt: Date.now()
    };
    setData(prev => ({
      ...prev,
      classes: [...prev.classes, newClass]
    }));
  };

  const addStudent = (classId: string, name: string) => {
    setData(prev => ({
      ...prev,
      classes: prev.classes.map(c => {
        if (c.id === classId) {
          const newStudent: Student = {
            id: Math.random().toString(36).substr(2, 9),
            classId,
            name,
            totalBonus: 0,
            bonusRecords: []
          };
          return { ...c, students: [...c.students, newStudent] };
        }
        return c;
      })
    }));
  };

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const giveBonus = (studentId: string, amount: number, category: BonusCategory) => {
    setData(prev => {
      const newClasses = prev.classes.map(c => ({
        ...c,
        students: c.students.map(s => {
          if (s.id === studentId) {
            const newTotal = Math.max(0, Math.min(s.totalBonus + amount, prev.settings.maxBonusLimit));
            const effectiveAmount = newTotal - s.totalBonus;
            
            // If the bonus doesn't actually add anything (already at max), 
            // we still record it but maybe with 0 effective amount?
            // Actually, let's record the effective amount to keep stats consistent with point gain.
            const record: BonusRecord = {
              id: Math.random().toString(36).substr(2, 9),
              studentId,
              classId: c.id,
              amount: effectiveAmount, // Store effective amount
              categoryName: category.name,
              timestamp: Date.now(),
              isRemoved: false
            };
            
            // Sound effect
            if (prev.settings.soundEnabled && newTotal === prev.settings.maxBonusLimit && s.totalBonus < prev.settings.maxBonusLimit) {
              console.log(`Playing ${prev.settings.soundType} sound!`);
            }

            return {
              ...s,
              totalBonus: newTotal,
              bonusRecords: [record, ...s.bonusRecords]
            };
          }
          return s;
        })
      }));
      return { ...prev, classes: newClasses };
    });
  };

  const removeLastBonus = (studentId: string) => {
    setData(prev => {
      let removedAmount = 0;
      const newClasses = prev.classes.map(c => ({
        ...c,
        students: c.students.map(s => {
          if (s.id === studentId) {
            const lastActiveBonusIndex = s.bonusRecords.findIndex(h => !h.isRemoved);
            if (lastActiveBonusIndex === -1) return s;
            
            const lastActiveBonus = s.bonusRecords[lastActiveBonusIndex];
            removedAmount = lastActiveBonus.amount;
            
            const newBonusRecords = [...s.bonusRecords];
            newBonusRecords[lastActiveBonusIndex] = { ...lastActiveBonus, isRemoved: true };
            
            const newTotal = Math.max(0, s.totalBonus - removedAmount);
            return {
              ...s,
              totalBonus: newTotal,
              bonusRecords: newBonusRecords
            };
          }
          return s;
        })
      }));
      
      if (removedAmount > 0) {
        setToast({ message: 'Last bonus removed', type: 'info' });
      }
      
      return { ...prev, classes: newClasses };
    });
  };

  const deleteBonus = (studentId: string, bonusId: string) => {
    setData(prev => {
      const newClasses = prev.classes.map(c => ({
        ...c,
        students: c.students.map(s => {
          if (s.id === studentId) {
            const bonusToDelete = s.bonusRecords.find(h => h.id === bonusId);
            if (!bonusToDelete || bonusToDelete.isRemoved) return s;
            
            const newTotal = Math.max(0, s.totalBonus - bonusToDelete.amount);
            return {
              ...s,
              totalBonus: newTotal,
              bonusRecords: s.bonusRecords.map(h => h.id === bonusId ? { ...h, isRemoved: true } : h)
            };
          }
          return s;
        })
      }));
      return { ...prev, classes: newClasses };
    });
  };

  const deleteClass = (id: string) => {
    setData(prev => ({
      ...prev,
      classes: prev.classes.filter(c => c.id !== id)
    }));
    if (selectedClassId === id) setSelectedClassId(null);
  };

  const archiveClass = (id: string) => {
    setData(prev => ({
      ...prev,
      classes: prev.classes.map(c => c.id === id ? { ...c, isArchived: !c.isArchived } : c)
    }));
  };

  const resetData = () => {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      setData({
        classes: [],
        settings: DEFAULT_SETTINGS,
        user: data.user
      });
    }
  };

  // Stats for dashboard
  const stats = useMemo(() => {
    const activeClasses = data.classes.filter(c => !c.isArchived);
    const allStudents = activeClasses.flatMap(c => c.students);
    const totalBonuses = allStudents.reduce((sum, s) => sum + s.totalBonus, 0);
    const topStudents = [...allStudents].sort((a, b) => b.totalBonus - a.totalBonus).slice(0, 3);
    const zeroBonusStudents = allStudents.filter(s => s.totalBonus === 0);
    const classAverages = activeClasses.map(c => ({
      name: c.name,
      avg: c.students.length > 0 ? c.students.reduce((sum, s) => sum + s.totalBonus, 0) / c.students.length : 0
    }));
    
    const today = new Date().setHours(0, 0, 0, 0);
    const activeHistoryToday = allStudents
      .flatMap(s => s.bonusRecords || [])
      .filter(h => h && h.timestamp >= today && !h.isRemoved);
    
    // Use effective amount if we want it to match totalBonus changes perfectly, 
    // but here we'll stick to the recorded amount and ensure it's capped correctly in giveBonus.
    const bonusesToday = activeHistoryToday.reduce((sum, h) => sum + h.amount, 0);
    
    const categoryBreakdownToday = activeHistoryToday.reduce((acc, h) => {
      acc[h.categoryName] = (acc[h.categoryName] || 0) + h.amount;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalBonuses,
      topStudents,
      zeroBonusStudents,
      classAverages,
      bonusesToday,
      categoryBreakdownToday,
      studentCount: allStudents.length,
      classCount: activeClasses.length
    };
  }, [data.classes]);

  if (showSplash) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary overflow-hidden">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl mb-6"
          >
            <Award className="text-primary w-14 h-14" />
          </motion.div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-black text-white tracking-tighter"
          >
            BonusTracker
          </motion.h1>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: 120 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="h-1 bg-white/30 rounded-full mt-4 overflow-hidden"
          >
            <motion.div 
              animate={{ x: [-120, 120] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="w-1/2 h-full bg-white"
            />
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (currentView === 'auth') {
    return <AuthView onLogin={login} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <header className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Award className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-lg">BonusTracker</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold">
          {data.user?.name.charAt(0).toUpperCase()}
        </div>
      </header>

      {/* Sidebar / Navigation (Desktop) */}
      <nav className="hidden md:flex w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-col sticky top-0 h-screen">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Award className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-lg">BonusTracker</span>
        </div>

        <div className="flex-1 px-4 py-2 space-y-1">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={currentView === 'dashboard'} 
            onClick={() => setCurrentView('dashboard')} 
          />
          <NavItem 
            icon={<BookOpen size={20} />} 
            label="Classes" 
            active={currentView === 'classes' || currentView === 'class-detail'} 
            onClick={() => setCurrentView('classes')} 
          />
          <NavItem 
            icon={<SettingsIcon size={20} />} 
            label="Settings" 
            active={currentView === 'settings'} 
            onClick={() => setCurrentView('settings')} 
          />
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold">
              {data.user?.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{data.user?.name}</p>
              <p className="text-xs text-slate-500 truncate">Teacher</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-500 hover:text-destructive hover:bg-destructive/5 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 py-3 flex items-center justify-around z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <MobileNavItem 
          icon={<LayoutDashboard size={24} />} 
          active={currentView === 'dashboard'} 
          onClick={() => setCurrentView('dashboard')} 
        />
        <MobileNavItem 
          icon={<BookOpen size={24} />} 
          active={currentView === 'classes' || currentView === 'class-detail'} 
          onClick={() => setCurrentView('classes')} 
        />
        <MobileNavItem 
          icon={<SettingsIcon size={24} />} 
          active={currentView === 'settings'} 
          onClick={() => setCurrentView('settings')} 
        />
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
        <AnimatePresence mode="wait">
          {currentView === 'dashboard' && (
            <DashboardView data={data} stats={stats} />
          )}

          {currentView === 'classes' && (
            <ClassesView 
              classes={data.classes} 
              onAddClass={addClass} 
              onSelectClass={(id) => {
                setSelectedClassId(id);
                setCurrentView('class-detail');
              }}
              onArchive={archiveClass}
              onDelete={deleteClass}
            />
          )}

          {currentView === 'class-detail' && selectedClassId && (
            <ClassDetailView 
              classData={data.classes.find(c => c.id === selectedClassId)!}
              settings={data.settings}
              onAddStudent={addStudent}
              onGiveBonus={giveBonus}
              onRemoveLastBonus={removeLastBonus}
              onDeleteBonus={deleteBonus}
              onBack={() => setCurrentView('classes')}
            />
          )}

          {/* Toast Notification */}
          <AnimatePresence>
            {toast && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 dark:bg-slate-800 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700"
              >
                {toast.type === 'info' ? <History size={18} className="text-blue-400" /> : <CheckCircle2 size={18} className="text-green-400" />}
                <span className="font-medium">{toast.message}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {currentView === 'settings' && (
            <SettingsView 
              settings={data.settings} 
              updateSettings={updateSettings}
              onReset={resetData}
              classes={data.classes}
              onArchive={archiveClass}
              onDelete={deleteClass}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
