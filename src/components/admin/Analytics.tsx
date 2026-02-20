import { useApp } from '../../context/AppContext';
import { cn } from '../../utils/cn';
import { ACTIVE_STUDENTS } from '../../data/mockData';

export function Analytics() {
  const { theme, contestTimeLeft, submissions, students } = useApp();
  const isDark = theme === 'dark';

  const activeCount = ACTIVE_STUDENTS.filter(s => s.currentStatus === 'Coding').length;
  const submittedCount = ACTIVE_STUDENTS.filter(s => s.currentStatus === 'Submitted').length;
  const warningCount = ACTIVE_STUDENTS.reduce((a, s) => a + s.warnings, 0);
  const flaggedCount = submissions.filter(s => s.tabSwitches > 2).length;

  const hours = Math.floor(contestTimeLeft / 3600);
  const minutes = Math.floor((contestTimeLeft % 3600) / 60);
  const seconds = contestTimeLeft % 60;
  const pad = (n: number) => String(n).padStart(2, '0');

  const statCards = [
    { label: 'Active Coders', value: activeCount, total: students.length, icon: '👨‍💻', color: 'from-violet-500 to-indigo-600', glow: 'shadow-violet-500/20' },
    { label: 'Submitted', value: submittedCount, total: students.length, icon: '✅', color: 'from-emerald-500 to-teal-600', glow: 'shadow-emerald-500/20' },
    { label: 'Total Warnings', value: warningCount, total: null, icon: '⚠️', color: 'from-amber-500 to-orange-600', glow: 'shadow-amber-500/20' },
    { label: 'Flagged', value: flaggedCount, total: null, icon: '🚩', color: 'from-red-500 to-rose-600', glow: 'shadow-red-500/20' },
    { label: 'Online Students', value: students.length, total: 200, icon: '🌐', color: 'from-blue-500 to-cyan-600', glow: 'shadow-blue-500/20' },
    {
      label: 'Time Left',
      value: `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`,
      total: null,
      icon: contestTimeLeft < 300 ? '🚨' : '⏱',
      color: contestTimeLeft < 300 ? 'from-red-500 to-rose-600' : contestTimeLeft < 900 ? 'from-amber-500 to-orange-600' : 'from-violet-600 to-indigo-700',
      glow: contestTimeLeft < 300 ? 'shadow-red-500/20' : '',
    },
  ];

  const langDist = [
    { lang: 'C++', count: 8, pct: 50, color: 'bg-cyan-500' },
    { lang: 'Python', count: 5, pct: 31, color: 'bg-yellow-500' },
    { lang: 'Java', count: 2, pct: 12, color: 'bg-orange-500' },
    { lang: 'C', count: 1, pct: 6, color: 'bg-blue-500' },
  ];

  const recentActivity = [
    { time: '2m ago', event: 'Sneha Patel submitted Valid Parentheses', type: 'submit' },
    { time: '5m ago', event: 'Vikram Singh: 4 tab switches detected', type: 'warning' },
    { time: '8m ago', event: 'Arjun Sharma submitted Two Sum', type: 'submit' },
    { time: '12m ago', event: 'Rohit Gupta: Inactivity detected (5 min)', type: 'warning' },
    { time: '15m ago', event: 'Kavya Reddy logged in', type: 'info' },
    { time: '20m ago', event: 'Priya Verma started coding Reverse LL', type: 'info' },
  ];

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map(card => (
          <div key={card.label} className={cn(
            'relative rounded-2xl p-4 overflow-hidden border transition-all hover:scale-[1.02]',
            isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'
          )}>
            <div className={cn('absolute inset-x-0 top-0 h-1 bg-gradient-to-r', card.color)} />
            <div className="text-2xl mb-2">{card.icon}</div>
            <div className={cn('text-2xl font-black font-mono', isDark ? 'text-white' : 'text-slate-900')}>
              {card.value}
              {card.total && <span className={cn('text-sm font-normal', isDark ? 'text-slate-500' : 'text-slate-400')}>/{card.total}</span>}
            </div>
            <div className={cn('text-xs font-medium mt-0.5', isDark ? 'text-slate-400' : 'text-slate-500')}>{card.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Language Distribution */}
        <div className={cn('rounded-2xl p-5 border', isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white')}>
          <h3 className={cn('text-sm font-bold mb-4', isDark ? 'text-white' : 'text-slate-900')}>📊 Language Distribution</h3>
          <div className="space-y-3">
            {langDist.map(l => (
              <div key={l.lang}>
                <div className="flex justify-between text-xs mb-1">
                  <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{l.lang}</span>
                  <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>{l.count} ({l.pct}%)</span>
                </div>
                <div className={cn('h-2 rounded-full overflow-hidden', isDark ? 'bg-white/10' : 'bg-slate-100')}>
                  <div className={cn('h-full rounded-full transition-all', l.color)} style={{ width: `${l.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submission Timeline */}
        <div className={cn('rounded-2xl p-5 border', isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white')}>
          <h3 className={cn('text-sm font-bold mb-4', isDark ? 'text-white' : 'text-slate-900')}>📈 Submission Timeline</h3>
          <div className="flex items-end gap-2 h-28">
            {[2, 5, 3, 8, 12, 7, 15, 10, 18, 14, 20, 16].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t bg-gradient-to-t from-violet-600 to-indigo-400 opacity-80 transition-all hover:opacity-100"
                  style={{ height: `${(val / 20) * 100}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-600">
            <span>0m</span><span>60m</span><span>120m</span>
          </div>
        </div>

        {/* Recent Activity */}
        <div className={cn('rounded-2xl p-5 border', isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white')}>
          <h3 className={cn('text-sm font-bold mb-4', isDark ? 'text-white' : 'text-slate-900')}>🕐 Recent Activity</h3>
          <div className="space-y-2.5">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className={cn('w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0',
                  a.type === 'submit' ? 'bg-emerald-400' : a.type === 'warning' ? 'bg-amber-400' : 'bg-slate-500'
                )} />
                <div>
                  <p className={cn('text-xs', isDark ? 'text-slate-300' : 'text-slate-700')}>{a.event}</p>
                  <p className={cn('text-xs', isDark ? 'text-slate-600' : 'text-slate-400')}>{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Problem Distribution */}
      <div className={cn('rounded-2xl p-5 border', isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white')}>
        <h3 className={cn('text-sm font-bold mb-4', isDark ? 'text-white' : 'text-slate-900')}>🎯 Problem Assignment Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {['Two Sum', 'Reverse LL', 'Max Subarray', 'Valid Parens', 'Fibonacci'].map((p, i) => (
            <div key={p} className={cn('rounded-xl p-3 text-center border', isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50')}>
              <div className={cn('text-2xl font-black', isDark ? 'text-white' : 'text-slate-900')}>{[3, 2, 3, 3, 2][i]}</div>
              <div className={cn('text-xs mt-1', isDark ? 'text-slate-400' : 'text-slate-500')}>{p}</div>
              <div className={cn('text-xs', isDark ? 'text-slate-600' : 'text-slate-400')}>{['Easy', 'Easy', 'Medium', 'Easy', 'Easy'][i]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
