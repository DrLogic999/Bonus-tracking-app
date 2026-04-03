import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, BookOpen, Archive, Users, ChevronRight } from 'lucide-react';
import { Class } from '../../types';

interface ClassesViewProps {
  classes: Class[];
  onAddClass: (name: string, courseName: string) => void;
  onSelectClass: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ClassesView({ classes, onAddClass, onSelectClass, onArchive, onDelete }: ClassesViewProps) {
  const [showAdd, setShowAdd] = useState(false);
  const activeClasses = classes.filter((c) => !c.isArchived);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Your Classes</h2>
          <p className="text-slate-500">Manage your courses and student groups.</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-primary/20 transition-all"
        >
          <Plus size={20} />
          <span>New Class</span>
        </button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeClasses.map((c) => (
          <div 
            key={c.id} 
            onClick={() => onSelectClass(c.id)}
            className="group bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer relative"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                <BookOpen size={24} />
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => { e.stopPropagation(); onArchive(c.id); }}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500"
                >
                  <Archive size={18} />
                </button>
              </div>
            </div>
            <h3 className="text-xl font-bold mb-1">{c.name}</h3>
            <p className="text-slate-500 text-sm mb-4">{c.courseName}</p>
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <Users size={16} />
                <span>{c.students.length} Students</span>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-primary transition-colors" />
            </div>
          </div>
        ))}

        {activeClasses.length === 0 && !showAdd && (
          <div className="col-span-full py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
              <BookOpen size={40} className="text-slate-300" />
            </div>
            <p className="text-slate-500">No active classes found. Create one to get started!</p>
          </div>
        )}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl p-6 shadow-2xl"
          >
            <h3 className="text-xl font-bold mb-4">Create New Class</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const name = (e.target as any).className.value;
              const course = (e.target as any).courseName.value;
              onAddClass(name, course);
              setShowAdd(false);
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Class Name</label>
                <input name="className" required placeholder="e.g. 10A, Morning Group" className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Course Name</label>
                <input name="courseName" required placeholder="e.g. Mathematics, English" className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors">Create</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
