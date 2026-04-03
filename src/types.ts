export interface BonusCategory {
  id: string;
  name: string;
  icon: string;
  defaultAmount: number;
}

export interface BonusRecord {
  id: string;
  studentId: string;
  classId: string;
  amount: number;
  categoryName: string;
  timestamp: number;
  note?: string;
  isRemoved?: boolean;
}

export interface Student {
  id: string;
  classId: string;
  name: string;
  totalBonus: number;
  bonusRecords: BonusRecord[];
}

export interface Class {
  id: string;
  name: string;
  courseName: string;
  students: Student[];
  isArchived: boolean;
  createdAt: number;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  animationsEnabled: boolean;
  maxBonusLimit: number;
  bonusCategories: BonusCategory[];
  notificationsEnabled: boolean;
  reminderTime: string;
  smartReminders: boolean;
  soundEnabled: boolean;
  soundType: 'ding' | 'bell' | 'chime';
}

export interface AppData {
  classes: Class[];
  settings: AppSettings;
  user: {
    name: string;
    isLoggedIn: boolean;
  } | null;
}
