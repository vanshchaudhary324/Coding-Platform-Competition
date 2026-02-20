import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { cn } from '../utils/cn';
import { CountdownTimer } from './student/CountdownTimer';
import { CodeEditor } from './student/CodeEditor';
import { ProblemPanel } from './student/ProblemPanel';
import { AntiCheatMonitor } from './student/AntiCheatMonitor';
import { SubmitModal } from './student/SubmitModal';

export function StudentWorkspace() {
  const { currentStudent, assignedQuestion, logout, theme, toggleTheme, isSubmitted, warningCount, tabSwitchCount, contest } = useApp();
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [activePanel, setActivePanel] = useState<'problem' | 'leaderboard'>('problem');
  const isDark = theme === 'dark';

  if (!currentStudent) return null;

  return (
    <div className={cn(
      'h-screen flex flex-col overflow-hidden transition-all duration-300',
      isDark ? 'bg-[#0a0f1e] text-white' : 'bg-slate-100 text-slate-900'
    )}>
      {/* TOP NAVBAR */}
      <header className={cn(
        'flex items-center gap-3 px-4 py-2.5 border-b flex-shrink-0 relative z-20',
        isDark ? 'bg-[#0d1117]/90 backdrop-blur-xl border-white/10' : 'bg-white/90 backdrop-blur-xl border-slate-200'
      )}>
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-sm shadow-lg shadow-violet-500/30">
            ⚡
          </div>
          <span className="font-black text-sm hidden sm:block">
            Code<span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Arena</span>
          </span>
        </div>

        <div className={cn('w-px h-6', isDark ? 'bg-white/10' : 'bg-slate-200')} />

        {/* Contest name */}
        <div className="flex-shrink-0 hidden md:block">
          <p className={cn('text-xs font-semibold', isDark ? 'text-slate-300' : 'text-slate-700')}>{contest.name}</p>
          <p className={cn('text-xs', isDark ? 'text-slate-500' : 'text-slate-400')}>{assignedQuestion?.title}</p>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* AntiCheat */}
        <div className="hidden lg:block">
          <AntiCheatMonitor />
        </div>

        {/* Timer */}
        <CountdownTimer />

        <div className={cn('w-px h-6', isDark ? 'bg-white/10' : 'bg-slate-200')} />

        {/* Profile */}
        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <p className={cn('text-xs font-bold leading-tight', isDark ? 'text-white' : 'text-slate-900')}>{currentStudent.name}</p>
            <p className={cn('text-xs leading-tight', isDark ? 'text-slate-500' : 'text-slate-400')}>{currentStudent.rollNo}</p>
          </div>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {currentStudent.name.charAt(0)}
          </div>
        </div>

        {/* Actions */}
        <button onClick={toggleTheme}
          className={cn('p-2 rounded-xl transition-all', isDark ? 'hover:bg-white/10' : 'hover:bg-slate-100')}>
          {isDark ? '☀️' : '🌙'}
        </button>

        {!isSubmitted && (
          <button onClick={() => setShowSubmitModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 text-white text-xs font-bold hover:from-violet-600 hover:to-indigo-700 transition-all shadow-lg shadow-violet-500/30 flex-shrink-0">
            🚀 Submit
          </button>
        )}

        {isSubmitted && (
          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            ✓ Submitted
          </div>
        )}

        <button onClick={logout}
          className={cn('p-2 rounded-xl transition-all text-xs', isDark ? 'text-slate-500 hover:text-slate-300 hover:bg-white/10' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100')}>
          ⏻
        </button>
      </header>

      {/* PROFILE + STATUS BAR */}
      <div className={cn(
        'flex items-center gap-4 px-4 py-2 border-b flex-shrink-0',
        isDark ? 'border-white/5 bg-white/[0.02]' : 'border-slate-200 bg-white/50'
      )}>
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className={cn('text-xs font-medium', isDark ? 'text-slate-400' : 'text-slate-500')}>Branch:</span>
              <span className={cn('text-xs font-semibold', isDark ? 'text-slate-300' : 'text-slate-700')}>{currentStudent.branch}</span>
              <span className={cn('text-slate-600', isDark ? '' : 'text-slate-300')}>·</span>
              <span className={cn('text-xs font-medium', isDark ? 'text-slate-400' : 'text-slate-500')}>Competition:</span>
              <span className={cn('text-xs font-semibold', isDark ? 'text-slate-300' : 'text-slate-700')}>{currentStudent.competition}</span>
            </div>
          </div>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          {warningCount > 0 && (
            <span className={cn('text-xs px-2 py-0.5 rounded-lg', warningCount > 3 ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400')}>
              ⚠️ {warningCount} warnings
            </span>
          )}
          {tabSwitchCount > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-lg bg-red-500/20 text-red-400">
              🔄 {tabSwitchCount} tab switches
            </span>
          )}
          <span className={cn('flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-lg', 
            isSubmitted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-green-500/20 text-green-400')}>
            <span className={cn('w-1.5 h-1.5 rounded-full', isSubmitted ? 'bg-emerald-400' : 'bg-green-400 animate-pulse')} />
            {isSubmitted ? 'Submitted' : 'Active'}
          </span>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel — Problem */}
        <div className="w-[380px] flex-shrink-0 p-3 overflow-hidden flex flex-col gap-2 border-r"
          style={{ borderColor: isDark ? 'rgba(255,255,255,0.07)' : '#e2e8f0' }}>
          <div className="flex gap-1.5 flex-shrink-0">
            {(['problem', 'leaderboard'] as const).map(p => (
              <button key={p} onClick={() => setActivePanel(p)}
                className={cn(
                  'flex-1 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all',
                  activePanel === p
                    ? 'bg-violet-500/20 text-violet-400 border border-violet-500/20'
                    : isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'
                )}>
                {p === 'problem' ? '📋 Problem' : '🏆 Leaderboard'}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-hidden">
            {activePanel === 'problem' ? (
              <ProblemPanel />
            ) : (
              <LeaderboardPanel />
            )}
          </div>
        </div>

        {/* Right Panel — Editor */}
        <div className="flex-1 p-3 overflow-hidden">
          <CodeEditor />
        </div>
      </div>

      {showSubmitModal && <SubmitModal onClose={() => setShowSubmitModal(false)} />}
    </div>
  );
}

function LeaderboardPanel() {
  const { theme } = useApp();
  const isDark = theme === 'dark';

  const data = [
    { rank: 1, name: 'Sneha Patel', score: 100, time: '45:12', lang: 'Python', badge: '🥇' },
    { rank: 2, name: 'Arjun Sharma', score: 95, time: '52:30', lang: 'C++', badge: '🥈' },
    { rank: 3, name: 'Priya Verma', score: 88, time: '58:44', lang: 'Python', badge: '🥉' },
    { rank: 4, name: 'Rohit Gupta', score: 82, time: '65:20', lang: 'Java', badge: '' },
    { rank: 5, name: 'Vikram Singh', score: 71, time: '78:10', lang: 'C', badge: '' },
    { rank: 6, name: 'Kavya Reddy', score: 65, time: '85:00', lang: 'C++', badge: '' },
  ];

  return (
    <div className={cn('h-full overflow-y-auto rounded-2xl border', isDark ? 'border-white/10' : 'border-slate-200')}>
      <div className={cn('sticky top-0 px-4 py-3 border-b', isDark ? 'border-white/10 bg-[#0d1117]' : 'border-slate-200 bg-white')}>
        <h3 className={cn('text-sm font-bold', isDark ? 'text-white' : 'text-slate-900')}>🏆 Live Leaderboard</h3>
        <p className={cn('text-xs', isDark ? 'text-slate-500' : 'text-slate-400')}>Updates every 60 seconds</p>
      </div>
      <div className="p-3 space-y-2">
        {data.map(s => (
          <div key={s.rank} className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-xl',
            s.rank <= 3 ? isDark ? 'bg-violet-500/10 border border-violet-500/20' : 'bg-violet-50 border border-violet-200' : isDark ? 'bg-white/5' : 'bg-slate-50'
          )}>
            <span className="text-sm w-6 text-center">{s.badge || `#${s.rank}`}</span>
            <div className="flex-1">
              <p className={cn('text-xs font-semibold', isDark ? 'text-white' : 'text-slate-900')}>{s.name}</p>
              <p className={cn('text-xs', isDark ? 'text-slate-500' : 'text-slate-400')}>{s.lang} · {s.time}</p>
            </div>
            <div className="text-right">
              <span className={cn('text-sm font-bold', s.rank === 1 ? 'text-amber-400' : isDark ? 'text-white' : 'text-slate-900')}>{s.score}</span>
              <p className={cn('text-xs', isDark ? 'text-slate-600' : 'text-slate-400')}>pts</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
