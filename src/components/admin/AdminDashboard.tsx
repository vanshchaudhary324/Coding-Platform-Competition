import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../utils/cn';
import { MonitoringTable } from './MonitoringTable';
import { QuestionManager } from './QuestionManager';
import { SubmissionViewer } from './SubmissionViewer';
import { Analytics } from './Analytics';
import { ContestSettings } from './ContestSettings';

type AdminTab = 'analytics' | 'monitoring' | 'questions' | 'submissions' | 'settings';

export function AdminDashboard() {
  const { logout, theme, toggleTheme, contestSettings, contestTimeLeft } = useApp();
  const [activeTab, setActiveTab] = useState<AdminTab>('analytics');
  const isDark = theme === 'dark';

  const pad = (n: number) => String(n).padStart(2, '0');
  const hours = Math.floor(contestTimeLeft / 3600);
  const minutes = Math.floor((contestTimeLeft % 3600) / 60);
  const seconds = contestTimeLeft % 60;
  const timeStr = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  const isUrgent = contestTimeLeft < 300;

  const tabs: { id: AdminTab; label: string; icon: string }[] = [
    { id: 'analytics',   label: 'Analytics',     icon: '📊' },
    { id: 'monitoring',  label: 'Live Monitor',  icon: '🔴' },
    { id: 'questions',   label: 'Questions',     icon: '📝' },
    { id: 'submissions', label: 'Submissions',   icon: '📦' },
    { id: 'settings',    label: 'Contest Setup', icon: '⚙️' },
  ];

  return (
    <div className={cn(
      'h-screen flex flex-col overflow-hidden transition-all',
      isDark ? 'bg-[#0a0f1e] text-white' : 'bg-slate-100 text-slate-900'
    )}>
      {/* Header */}
      <header className={cn(
        'flex items-center gap-4 px-6 py-3 border-b flex-shrink-0',
        isDark ? 'bg-[#0d1117]/90 backdrop-blur-xl border-white/10' : 'bg-white/90 backdrop-blur-xl border-slate-200'
      )}>
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-base shadow-lg shadow-emerald-500/30">
            🛡
          </div>
          <div>
            <h1 className={cn('text-sm font-black leading-tight', isDark ? 'text-white' : 'text-slate-900')}>
              Admin Dashboard
            </h1>
            <p className={cn('text-xs', isDark ? 'text-slate-500' : 'text-slate-400')}>CodeArena · CSJMU UIET</p>
          </div>
        </div>

        <div className={cn('w-px h-8', isDark ? 'bg-white/10' : 'bg-slate-200')} />

        {/* Contest Info */}
        <div className="hidden md:block">
          <p className={cn('text-xs font-semibold', isDark ? 'text-slate-300' : 'text-slate-700')}>
            {contestSettings.name}
          </p>
          <p className={cn('text-xs', isDark ? 'text-slate-500' : 'text-slate-400')}>
            Status: <span className="text-emerald-400 font-semibold">● {contestSettings.status}</span>
            <span className="ml-2 text-slate-500">·</span>
            <span className="ml-2">Key: <span className="font-mono text-amber-400">{contestSettings.passKey}</span></span>
          </p>
        </div>

        <div className="flex-1" />

        {/* Live Timer */}
        <div className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-2xl border font-mono text-sm font-bold',
          isUrgent
            ? 'border-red-500/40 bg-red-500/10 text-red-400 animate-pulse'
            : isDark ? 'border-white/10 bg-white/5 text-white' : 'border-slate-200 bg-white text-slate-800'
        )}>
          <span className="text-base">{isUrgent ? '🚨' : '⏱'}</span>
          {timeStr}
        </div>

        <button onClick={toggleTheme}
          className={cn('p-2 rounded-xl', isDark ? 'hover:bg-white/10' : 'hover:bg-slate-100')}>
          {isDark ? '☀️' : '🌙'}
        </button>

        <button onClick={logout}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all border',
            isDark ? 'border-white/10 text-slate-400 hover:border-red-500/30 hover:text-red-400' : 'border-slate-200 text-slate-500 hover:border-red-500/30 hover:text-red-500'
          )}>
          ⏻ Logout
        </button>
      </header>

      {/* Tab Bar */}
      <div className={cn(
        'flex items-center gap-1 px-6 py-2 border-b flex-shrink-0',
        isDark ? 'border-white/10 bg-white/[0.02]' : 'border-slate-200 bg-white/50'
      )}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all',
              activeTab === tab.id
                ? 'bg-violet-500/20 text-violet-400 border border-violet-500/20'
                : isDark ? 'text-slate-500 hover:text-slate-300 hover:bg-white/5' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            )}>
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.id === 'monitoring' && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
            {tab.id === 'settings' && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
          </button>
        ))}

        <div className="flex-1" />
        <div className={cn('text-xs px-3 py-1.5 rounded-lg', isDark ? 'bg-white/5 text-slate-500' : 'bg-slate-100 text-slate-400')}>
          Last sync: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'analytics'   && <Analytics />}
        {activeTab === 'monitoring'  && <MonitoringTable />}
        {activeTab === 'questions'   && <QuestionManager />}
        {activeTab === 'submissions' && <SubmissionViewer />}
        {activeTab === 'settings'    && <ContestSettings />}
      </div>
    </div>
  );
}
