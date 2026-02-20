import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../utils/cn';
import { ACTIVE_STUDENTS } from '../../data/mockData';
import type { ActiveStudent } from '../../types';

export function MonitoringTable() {
  const { theme } = useApp();
  const isDark = theme === 'dark';
  const [selectedStudent, setSelectedStudent] = useState<ActiveStudent | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'idle' | 'submitted'>('all');
  const [search, setSearch] = useState('');

  const filtered = ACTIVE_STUDENTS.filter(s => {
    const status = s.currentStatus.toLowerCase();
    if (filter !== 'all' && status !== filter) return false;
    if (search && !s.student.name.toLowerCase().includes(search.toLowerCase()) &&
      !s.student.rollNo.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const statusColor = (status: string) => {
    if (status === 'Submitted') return isDark ? 'text-emerald-400' : 'text-emerald-600';
    if (status === 'Coding') return isDark ? 'text-violet-400' : 'text-violet-600';
    return isDark ? 'text-slate-500' : 'text-slate-400';
  };

  const warningColor = (w: number) => {
    if (w > 4) return 'text-red-400';
    if (w > 2) return 'text-amber-400';
    return isDark ? 'text-slate-500' : 'text-slate-400';
  };

  const handleExport = (fmt: string) => {
    alert(`Exporting report as ${fmt}... (In production, this would download the file)`);
  };

  return (
    <div className="h-full flex overflow-hidden">
      {/* Table */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className={cn('flex items-center gap-3 px-4 py-3 border-b flex-shrink-0', isDark ? 'border-white/10' : 'border-slate-200')}>
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or roll no..."
            className={cn(
              'px-3 py-2 rounded-xl text-sm outline-none border w-64',
              isDark ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-violet-500' : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-violet-500'
            )}
          />

          <div className="flex gap-1">
            {(['all', 'active', 'idle', 'submitted'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all',
                  filter === f
                    ? 'bg-violet-500/20 text-violet-400 border border-violet-500/20'
                    : isDark ? 'text-slate-500 hover:bg-white/5' : 'text-slate-400 hover:bg-slate-100'
                )}>
                {f}
              </button>
            ))}
          </div>

          <div className="flex-1" />

          <div className="flex gap-2">
            {['CSV', 'Excel', 'PDF'].map(fmt => (
              <button key={fmt} onClick={() => handleExport(fmt)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border',
                  isDark ? 'border-white/10 text-slate-400 hover:bg-white/10' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                )}>
                ↓ {fmt}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-red-400">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Live
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={cn('border-b text-xs', isDark ? 'border-white/10 bg-white/[0.02]' : 'border-slate-200 bg-slate-50')}>
                {['Student', 'Roll No', 'Status', 'Language', 'Code Length', 'Tab Switches', 'Warnings', 'Last Activity', 'Submission'].map(h => (
                  <th key={h} className={cn('px-4 py-3 text-left font-semibold uppercase tracking-wider', isDark ? 'text-slate-500' : 'text-slate-400')}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.student.id}
                  onClick={() => setSelectedStudent(s)}
                  className={cn(
                    'border-b cursor-pointer transition-all',
                    isDark ? 'border-white/5 hover:bg-white/5' : 'border-slate-100 hover:bg-slate-50',
                    selectedStudent?.student.id === s.student.id ? isDark ? 'bg-violet-500/10' : 'bg-violet-50' : ''
                  )}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {s.student.name.charAt(0)}
                      </div>
                      <div>
                        <p className={cn('font-semibold text-xs', isDark ? 'text-white' : 'text-slate-900')}>{s.student.name}</p>
                        <p className={cn('text-xs', isDark ? 'text-slate-500' : 'text-slate-400')}>{s.student.branch}</p>
                      </div>
                    </div>
                  </td>
                  <td className={cn('px-4 py-3 text-xs font-mono', isDark ? 'text-slate-400' : 'text-slate-500')}>{s.student.rollNo}</td>
                  <td className="px-4 py-3">
                    <span className={cn('flex items-center gap-1.5 text-xs font-semibold', statusColor(s.currentStatus))}>
                      <span className={cn('w-1.5 h-1.5 rounded-full', s.currentStatus === 'Coding' ? 'bg-violet-400 animate-pulse' : s.currentStatus === 'Submitted' ? 'bg-emerald-400' : 'bg-slate-500')} />
                      {s.currentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn('text-xs px-2 py-0.5 rounded-lg', isDark ? 'bg-white/10 text-slate-300' : 'bg-slate-100 text-slate-600')}>
                      {s.language}
                    </span>
                  </td>
                  <td className={cn('px-4 py-3 text-xs font-mono', isDark ? 'text-slate-400' : 'text-slate-500')}>{s.codeLength} chars</td>
                  <td className="px-4 py-3">
                    <span className={cn('text-xs font-bold', s.tabSwitches > 3 ? 'text-red-400' : s.tabSwitches > 0 ? 'text-amber-400' : isDark ? 'text-slate-600' : 'text-slate-400')}>
                      {s.tabSwitches > 0 ? `⚡ ${s.tabSwitches}` : '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn('text-xs font-bold', warningColor(s.warnings))}>
                      {s.warnings > 0 ? `⚠️ ${s.warnings}` : '—'}
                    </span>
                  </td>
                  <td className={cn('px-4 py-3 text-xs', isDark ? 'text-slate-500' : 'text-slate-400')}>{fmtTime(s.lastActivity)}</td>
                  <td className="px-4 py-3">
                    {s.submission ? (
                      <span className="text-xs px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                        ✓ Submitted
                      </span>
                    ) : (
                      <span className={cn('text-xs', isDark ? 'text-slate-600' : 'text-slate-300')}>Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={cn('px-4 py-2 border-t text-xs flex items-center gap-4', isDark ? 'border-white/10 text-slate-600' : 'border-slate-200 text-slate-400')}>
          <span>Showing {filtered.length} of {ACTIVE_STUDENTS.length} students</span>
          <span>Total online: {ACTIVE_STUDENTS.length}</span>
        </div>
      </div>

      {/* Detail Panel */}
      {selectedStudent && (
        <div className={cn('w-72 flex-shrink-0 border-l overflow-y-auto', isDark ? 'border-white/10 bg-white/[0.02]' : 'border-slate-200 bg-slate-50')}>
          <div className={cn('sticky top-0 px-4 py-3 border-b flex items-center justify-between', isDark ? 'border-white/10 bg-[#0d1117]' : 'border-slate-200 bg-white')}>
            <h3 className={cn('text-sm font-bold', isDark ? 'text-white' : 'text-slate-900')}>Student Details</h3>
            <button onClick={() => setSelectedStudent(null)} className="text-slate-500 hover:text-slate-300">✕</button>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-lg font-bold">
                {selectedStudent.student.name.charAt(0)}
              </div>
              <div>
                <p className={cn('font-bold', isDark ? 'text-white' : 'text-slate-900')}>{selectedStudent.student.name}</p>
                <p className={cn('text-xs', isDark ? 'text-slate-400' : 'text-slate-500')}>{selectedStudent.student.rollNo}</p>
                <p className={cn('text-xs', isDark ? 'text-slate-500' : 'text-slate-400')}>{selectedStudent.student.branch}</p>
              </div>
            </div>

            {[
              { label: 'IP Address', value: selectedStudent.student.ip },
              { label: 'Device', value: selectedStudent.student.device },
              { label: 'Language', value: selectedStudent.language },
              { label: 'Code Length', value: `${selectedStudent.codeLength} chars` },
              { label: 'Tab Switches', value: String(selectedStudent.tabSwitches), alert: selectedStudent.tabSwitches > 2 },
              { label: 'Warnings', value: String(selectedStudent.warnings), alert: selectedStudent.warnings > 3 },
              { label: 'Last Active', value: fmtTime(selectedStudent.lastActivity) },
              { label: 'Login Time', value: new Date(selectedStudent.student.loginTime).toLocaleTimeString() },
            ].map(item => (
              <div key={item.label} className={cn('flex justify-between text-xs py-1.5 border-b', isDark ? 'border-white/5' : 'border-slate-100')}>
                <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>{item.label}</span>
                <span className={cn('font-semibold', item.alert ? 'text-red-400' : isDark ? 'text-slate-300' : 'text-slate-700')}>{item.value}</span>
              </div>
            ))}

            {selectedStudent.submission && (
              <div className={cn('rounded-xl p-3 border', isDark ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-emerald-200 bg-emerald-50')}>
                <p className="text-xs font-bold text-emerald-400 mb-2">✓ Submission Details</p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>Time</span>
                    <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{new Date(selectedStudent.submission.submittedAt).toLocaleTimeString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>Score</span>
                    <span className="text-emerald-400 font-bold">{selectedStudent.submission.score}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>Plagiarism</span>
                    <span className={selectedStudent.submission.plagiarismScore > 30 ? 'text-red-400' : 'text-emerald-400'}>
                      {selectedStudent.submission.plagiarismScore}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function fmtTime(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  return `${Math.floor(diff / 60)}m ago`;
}
