import { AppData, AppSettings } from '../types';

const STORAGE_KEY = 'bonus_tracker_data';

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  animationsEnabled: true,
  maxBonusLimit: 10,
  bonusCategories: [
    { id: '1', name: 'Participation', icon: 'MessageSquare', defaultAmount: 1 },
    { id: '2', name: 'Homework', icon: 'BookOpen', defaultAmount: 2 },
    { id: '3', name: 'Behavior', icon: 'Smile', defaultAmount: 1 },
    { id: '4', name: 'Quiz', icon: 'Target', defaultAmount: 5 },
  ],
  notificationsEnabled: true,
  reminderTime: '16:00',
  smartReminders: true,
  soundEnabled: true,
  soundType: 'ding',
};

export const loadData = (): AppData => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const data = JSON.parse(stored);
      
      // Migrate settings
      if (!data.settings.bonusCategories) {
        data.settings.bonusCategories = DEFAULT_SETTINGS.bonusCategories;
      }

      // Migrate classes and students
      data.classes = (data.classes || []).map((c: any) => ({
        ...c,
        students: (c.students || []).map((s: any) => {
          const bonusRecords = s.bonusRecords || s.history || [];
          return {
            ...s,
            bonusRecords: bonusRecords.map((r: any) => ({
              ...r,
              categoryName: r.categoryName || r.category || 'Other'
            }))
          };
        })
      }));

      return data;
    } catch (e) {
      console.error('Failed to parse stored data', e);
    }
  }
  return {
    classes: [],
    settings: DEFAULT_SETTINGS,
    user: null,
  };
};

export const saveData = (data: AppData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};
