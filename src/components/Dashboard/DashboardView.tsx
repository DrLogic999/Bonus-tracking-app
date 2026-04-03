import React from 'react';
import { motion } from 'motion/react';
import { Award, BookOpen, Users, AlertCircle, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AppData } from '../../types';
import { cn } from '../../lib/utils';
import { StatCard } from './StatCard';

interface DashboardViewProps {
  data: AppData;
  stats: any;
}

export function DashboardView({ data, stats }: DashboardViewProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Welcome, {data.user?.name}</h2>
          <p className="text-slate-500">Here's what's happening in your classes today.</p>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Bonuses" value={stats.totalBonuses} icon={Award} color="bg-blue-100 text-blue-600" />
        <StatCard label="Active Classes" value={stats.classCount} icon={BookOpen} color="bg-purple-100 text-purple-600" />
        <StatCard label="Total Students" value={stats.studentCount} icon={Users} color="bg-orange-100 text-orange-600" />
        <StatCard label="Zero Bonus" value={stats.zeroBonusStudents.length} icon={AlertCircle} color="bg-red-100 text-red-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Class Averages Chart */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <TrendingUp className="text-primary" />
            Class Performance Comparison
          </h3>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm h-[300px]">
            {stats.classAverages.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.classAverages}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f1f5f9' }}
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
                    }}
                  />
                  <Bar dataKey="avg" radius={[4, 4, 0, 0]}>
                    {stats.classAverages.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#2563eb' : '#8b5cf6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500">
                No data to display.
              </div>
            )}
          </div>
        </div>

        {/* Top Students */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Award className="text-yellow-500" />
            Top 3 Students
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {stats.topStudents.length > 0 ? stats.topStudents.map((student: any, idx: number) => (
              <div key={student.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 shadow-sm">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg",
                  idx === 0 ? "bg-yellow-100 text-yellow-700" : 
                  idx === 1 ? "bg-slate-100 text-slate-700" : 
                  "bg-orange-100 text-orange-700"
                )}>
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{student.name}</h4>
                  <p className="text-xs text-slate-500">
                    {data.classes.find(c => c.id === student.classId)?.name}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-primary">{student.totalBonus}</div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Points</div>
                </div>
              </div>
            )) : (
              <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center">
                <p className="text-slate-500">No bonuses awarded yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Class Averages */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <TrendingUp className="text-primary" />
            Class Averages
          </h3>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            {stats.classAverages.length > 0 ? stats.classAverages.map((avg: any) => (
              <div key={avg.name} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{avg.name}</span>
                  <span className="text-slate-500">{avg.avg.toFixed(1)} avg</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-500" 
                    style={{ width: `${(avg.avg / data.settings.maxBonusLimit) * 100}%` }}
                  />
                </div>
              </div>
            )) : (
              <p className="text-slate-500 text-center py-4">No classes yet.</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
