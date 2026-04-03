import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Plus, Search, X, History, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Class, AppSettings, BonusCategory } from '../../types';
import { cn } from '../../lib/utils';
import { FilterButton } from '../Common/FilterButton';
import { StudentCard } from './StudentCard';
import { CategoryIcon } from '../Common/CategoryIcon';

interface ClassDetailViewProps {
  classData: Class;
  settings: AppSettings;
  onAddStudent: (classId: string, name: string) => void;
  onGiveBonus: (studentId: string, amount: number, category: BonusCategory) => void;
  onRemoveLastBonus: (studentId: string) => void;
  onDeleteBonus: (studentId: string, bonusId: string) => void;
  onBack: () => void;
}

export function ClassDetailView({ 
  classData, 
  settings, 
  onAddStudent, 
  onGiveBonus, 
  onRemoveLastBonus, 
  onDeleteBonus, 
  onBack 
}: ClassDetailViewProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'highest' | 'lowest' | 'zero'>('all');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const filteredStudents = useMemo(() => {
    let result = classData.students.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));
    if (filter === 'highest') result.sort((a, b) => b.totalBonus - a.totalBonus);
    if (filter === 'lowest') result.sort((a, b) => a.totalBonus - b.totalBonus);
    if (filter === 'zero') result = result.filter((s) => s.totalBonus === 0);
    return result;
  }, [classData.students, search, filter]);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-6xl mx-auto space-y-6"
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
            <BookOpen className="rotate-180" size={24} />
          </button>
          <div>
            <h2 className="text-3xl font-bold">{classData.name}</h2>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-slate-500">{classData.courseName} • {classData.students.length} Students</p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-primary/20 transition-all"
        >
          <Plus size={20} />
          <span>Add Student</span>
        </button>
      </header>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students..." 
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 outline-none focus:ring-2 focus:ring-primary" 
          />
        </div>
      </div>

      <div className="flex gap-2">
        <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>All</FilterButton>
        <FilterButton active={filter === 'highest'} onClick={() => setFilter('highest')}>Highest</FilterButton>
        <FilterButton active={filter === 'lowest'} onClick={() => setFilter('lowest')}>Lowest</FilterButton>
        <FilterButton active={filter === 'zero'} onClick={() => setFilter('zero')}>Zero</FilterButton>
      </div>

      {/* Student List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredStudents.map((student) => (
            <StudentCard 
              student={student}
              settings={settings}
              onGiveBonus={(amount, category) => onGiveBonus(student.id, amount, category)}
              onRemoveLastBonus={() => onRemoveLastBonus(student.id)}
              onViewHistory={() => setSelectedStudent(student)}
            />
        ))}
        {filteredStudents.length === 0 && (
          <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
            <p className="text-slate-500">No students found.</p>
          </div>
        )}
      </div>

      {/* Add Student Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl p-6 shadow-2xl"
          >
            <h3 className="text-xl font-bold mb-4">Add New Student</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const name = (e.target as any).studentName.value;
              onAddStudent(classData.id, name);
              setShowAdd(false);
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Student Name</label>
                <input name="studentName" required autoFocus placeholder="Enter full name" className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors">Add</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* History Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl p-6 shadow-2xl max-h-[80vh] flex flex-col"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold">{selectedStudent.name}</h3>
                <p className="text-slate-500">Bonus History • Total: {selectedStudent.totalBonus}</p>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {(selectedStudent.bonusRecords || []).length > 0 ? (selectedStudent.bonusRecords || []).map((h: any) => (
                <div key={h.id} className={cn(
                  "flex items-center justify-between p-4 rounded-xl border transition-opacity",
                  h.isRemoved ? "bg-slate-50/50 dark:bg-slate-800/20 border-slate-100 dark:border-slate-800 opacity-50" : "bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800"
                )}>
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center font-bold",
                      h.isRemoved ? "bg-slate-200 text-slate-400" : "bg-primary/10 text-primary"
                    )}>
                      {h.isRemoved ? <X size={16} /> : `+${h.amount}`}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <CategoryIcon iconName="Award" size={14} className={h.isRemoved ? "text-slate-300" : "text-slate-400"} />
                        <p className={cn("font-semibold capitalize", h.isRemoved && "line-through")}>{h.categoryName}</p>
                        {h.isRemoved && <span className="text-[10px] font-bold uppercase tracking-wider text-red-500 bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 rounded">Removed</span>}
                      </div>
                      <p className="text-xs text-slate-500">{format(h.timestamp, 'MMM d, yyyy • HH:mm')}</p>
                    </div>
                  </div>
                  {!h.isRemoved && (
                    <button 
                      onClick={() => {
                        if(confirm('Remove this bonus record?')) {
                          onDeleteBonus(selectedStudent.id, h.id);
                          // Update local state for immediate feedback
                          setSelectedStudent((prev: any) => ({
                            ...prev,
                            totalBonus: Math.max(0, prev.totalBonus - h.amount),
                            bonusRecords: (prev.bonusRecords || []).map((item: any) => item.id === h.id ? { ...item, isRemoved: true } : item)
                          }));
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-destructive transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              )) : (
                <div className="py-10 text-center text-slate-500">No history records found.</div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
