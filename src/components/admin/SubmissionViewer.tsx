import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../utils/cn';
import type { Submission } from '../../types';

const STATUS_STYLE: Record<string, string> = {
  accepted: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  wrong_answer: 'text-red-400 bg-red-500/10 border-red-500/20',
  runtime_error: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  time_limit: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  pending: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
  flagged: 'text-red-400 bg-red-500/10 border-red-500/20',
};

const STATUS_LABEL: Record<string, string> = {
  accepted: '✓ Accepted',
  wrong_answer: '✗ Wrong Answer',
  runtime_error: '⚡ Runtime Error',
  time_limit: '⏱ Time Limit',
  pending: '⟳ Pending',
  flagged: '🚩 Flagged',
};

function fmtTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export function SubmissionViewer() {
  const { submissions, students, questions, updateSubmission, theme } = useApp();
  const isDark = theme === 'dark';
  const [selected, setSelected] = useState<Submission | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'accepted' | 'pending' | 'flagged' | 'wrong_answer'>('all');
  const [search, setSearch] = useState('');
  const [editScore, setEditScore] = useState<number | null>(null);
  const [rerunning, setRerunning] = useState(false);
  const [sortBy, setSortBy] = useState<'time' | 'score' | 'plagiarism'>('time');

  const getStudent = (id: string) => students.find(s => s.id === id);
  const getQuestion = (id: string) => questions.find(q => q.id === id);

  const filtered = [...submissions]
    .filter(s => {
      if (filterStatus !== 'all' && s.status !== filterStatus) return false;
      const student = getStudent(s.studentId);
      if (search && student && !student.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'time') return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
      if (sortBy === 'score') return b.score - a.score;
      if (sortBy === 'plagiarism') return b.plagiarismScore - a.plagiarismScore;
      return 0;
    });

  const handleRerun = async () => {
    if (!selected) return;
    setRerunning(true);
    await new Promise(r => setTimeout(r, 2000));
    updateSubmission(selected.id, {
      executionTime: Math.floor(Math.random() * 80) + 15,
      output: 'Re-evaluated: Test cases passed 3/3',
      status: 'accepted',
    });
    setRerunning(false);
    alert('Re-evaluation complete!');
  };

  const handleSaveScore = () => {
    if (!selected || editScore === null) return;
    updateSubmission(selected.id, { score: editScore });
    setSelected(prev => prev ? { ...prev, score: editScore } : null);
    setEditScore(null);
    alert(`Score updated to ${editScore}/100`);
  };

  const handleFlag = () => {
    if (!selected) return;
    const newStatus = selected.status === 'flagged' ? 'accepted' : 'flagged';
    updateSubmission(selected.id, { status: newStatus });
    setSelected(prev => prev ? { ...prev, status: newStatus } : null);
  };

  const handleExport = (fmt: string) => {
    if (fmt === 'CSV') {
      const headers = 'Student,Roll No,Question,Language,Status,Score,Execution Time,Plagiarism,Tab Switches,Submitted At\n';
      const rows = filtered.map(s => {
        const student = getStudent(s.studentId);
        const question = getQuestion(s.questionId);
        return `"${student?.name || ''}","${student?.rollNo || ''}","${question?.title || ''}","${s.language}","${s.status}","${s.score}","${s.executionTime}ms","${s.plagiarismScore}%","${s.tabSwitches}","${fmtDate(s.submittedAt)} ${fmtTime(s.submittedAt)}"`;
      }).join('\n');
      const blob = new Blob([headers + rows], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'submissions.csv'; a.click();
    } else {
      alert(`Exporting as ${fmt}... (CSV is fully functional in demo)`);
    }
  };

  return (
    <div className="h-full flex overflow-hidden">
      {/* Left: Submission List */}
      <div className={cn('w-96 flex-shrink-0 flex flex-col border-r', isDark ? 'border-white/10' : 'border-slate-200')}>
        {/* Toolbar */}
        <div className={cn('p-3 border-b space-y-2 flex-shrink-0', isDark ? 'border-white/10' : 'border-slate-200')}>
          <div className="flex gap-2 items-center">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by student name..."
              className={cn(
                'flex-1 px-3 py-1.5 rounded-lg text-xs outline-none border',
                isDark ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-violet-500' : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-violet-500'
              )}
            />
            <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}
              className={cn(
                'px-2 py-1.5 rounded-lg text-xs outline-none border',
                isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
              )}>
              <option value="time">By Time</option>
              <option value="score">By Score</option>
              <option value="plagiarism">By Plagiarism</option>
            </select>
          </div>
          <div className="flex gap-1 flex-wrap">
            {(['all', 'accepted', 'pending', 'flagged', 'wrong_answer'] as const).map(f => (
              <button key={f} onClick={() => setFilterStatus(f)}
                className={cn(
                  'px-2.5 py-1 rounded-lg text-xs font-medium transition-all capitalize',
                  filterStatus === f ? 'bg-violet-500/20 text-violet-400 border border-violet-500/20' : isDark ? 'text-slate-500 hover:bg-white/5' : 'text-slate-400 hover:bg-slate-100'
                )}>
                {f === 'wrong_answer' ? 'Wrong' : f}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {['CSV', 'Excel', 'PDF'].map(fmt => (
              <button key={fmt} onClick={() => handleExport(fmt)}
                className={cn(
                  'flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all border',
                  isDark ? 'border-white/10 text-slate-400 hover:bg-white/10' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                )}>
                ↓ {fmt}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {filtered.length === 0 && (
            <div className="text-center text-slate-500 text-xs py-8">No submissions found</div>
          )}
          {filtered.map(sub => {
            const student = getStudent(sub.studentId);
            const question = getQuestion(sub.questionId);
            return (
              <div
                key={sub.id}
                onClick={() => { setSelected(sub); setEditScore(null); }}
                className={cn(
                  'rounded-xl p-3 cursor-pointer border transition-all',
                  selected?.id === sub.id
                    ? isDark ? 'bg-violet-500/10 border-violet-500/30' : 'bg-violet-50 border-violet-300'
                    : isDark ? 'border-white/5 hover:border-white/10 hover:bg-white/5' : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {student?.name.charAt(0) || '?'}
                    </div>
                    <div>
                      <p className={cn('text-xs font-semibold', isDark ? 'text-white' : 'text-slate-900')}>{student?.name || 'Unknown'}</p>
                      <p className={cn('text-xs', isDark ? 'text-slate-500' : 'text-slate-400')}>{question?.title || sub.questionId}</p>
                    </div>
                  </div>
                  <span className={cn('text-xs px-1.5 py-0.5 rounded-lg border font-medium flex-shrink-0', STATUS_STYLE[sub.status])}>
                    {STATUS_LABEL[sub.status]}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-2 text-xs">
                  <span className={cn('px-1.5 py-0.5 rounded font-mono', isDark ? 'bg-white/10 text-slate-300' : 'bg-slate-100 text-slate-600')}>{sub.language.toUpperCase()}</span>
                  <span className={cn(isDark ? 'text-slate-500' : 'text-slate-400')}>{sub.executionTime}ms</span>
                  <span className={cn('font-semibold', sub.score >= 90 ? 'text-emerald-400' : sub.score >= 70 ? 'text-amber-400' : 'text-red-400')}>
                    {sub.score}/100
                  </span>
                  {sub.plagiarismScore > 30 && (
                    <span className="text-red-400">🔴 {sub.plagiarismScore}% sim</span>
                  )}
                  {sub.tabSwitches > 2 && <span className="text-amber-400">⚡ {sub.tabSwitches}</span>}
                </div>
                <p className={cn('text-xs mt-1', isDark ? 'text-slate-600' : 'text-slate-400')}>
                  {fmtDate(sub.submittedAt)} · {fmtTime(sub.submittedAt)}
                </p>
              </div>
            );
          })}
        </div>

        <div className={cn('px-3 py-2 border-t text-xs', isDark ? 'border-white/10 text-slate-600' : 'border-slate-200 text-slate-400')}>
          {filtered.length} submission(s)
        </div>
      </div>

      {/* Right: Submission Detail */}
      <div className="flex-1 overflow-y-auto">
        {selected ? (
          <SubmissionDetail
            submission={selected}
            student={getStudent(selected.studentId)}
            question={getQuestion(selected.questionId)}
            isDark={isDark}
            onRerun={handleRerun}
            rerunning={rerunning}
            onFlag={handleFlag}
            editScore={editScore}
            setEditScore={setEditScore}
            onSaveScore={handleSaveScore}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="text-5xl mb-4">📦</div>
            <h3 className={cn('text-lg font-bold mb-2', isDark ? 'text-white' : 'text-slate-900')}>Submission Viewer</h3>
            <p className={cn('text-sm', isDark ? 'text-slate-400' : 'text-slate-500')}>
              Select a submission from the left to view full details, code, output, and evaluation options.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function SubmissionDetail({
  submission,
  student,
  question,
  isDark,
  onRerun,
  rerunning,
  onFlag,
  editScore,
  setEditScore,
  onSaveScore,
}: {
  submission: Submission;
  student: ReturnType<ReturnType<typeof useApp>['students']['find']>;
  question: ReturnType<ReturnType<typeof useApp>['questions']['find']>;
  isDark: boolean;
  onRerun: () => void;
  rerunning: boolean;
  onFlag: () => void;
  editScore: number | null;
  setEditScore: (v: number | null) => void;
  onSaveScore: () => void;
}) {
  const [showCode, setShowCode] = useState(true);

  const infoCls = cn(
    'rounded-2xl p-5 border',
    isDark ? 'border-white/10 bg-white/[0.02]' : 'border-slate-200 bg-white'
  );

  return (
    <div className="p-6 space-y-5 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={cn('text-xs font-bold px-2 py-0.5 rounded-lg border', STATUS_STYLE[submission.status])}>
              {STATUS_LABEL[submission.status]}
            </span>
            {submission.tabSwitches > 2 && (
              <span className="text-xs px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                ⚡ {submission.tabSwitches} Tab Switches
              </span>
            )}
            {submission.plagiarismScore > 30 && (
              <span className="text-xs px-2 py-0.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
                🔴 High Similarity: {submission.plagiarismScore}%
              </span>
            )}
          </div>
          <h2 className={cn('text-xl font-black', isDark ? 'text-white' : 'text-slate-900')}>
            {student?.name || 'Unknown Student'}
          </h2>
          <p className={cn('text-sm mt-0.5', isDark ? 'text-slate-400' : 'text-slate-500')}>
            {student?.rollNo} · {student?.branch}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={onRerun} disabled={rerunning}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all border',
              isDark ? 'border-white/10 text-slate-300 hover:bg-white/10' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            )}>
            {rerunning ? <span className="animate-spin">⟳</span> : '▶'} {rerunning ? 'Re-evaluating...' : 'Re-evaluate'}
          </button>
          <button onClick={onFlag}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all border',
              submission.status === 'flagged'
                ? 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                : isDark ? 'border-white/10 text-slate-300 hover:bg-white/10' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            )}>
            🚩 {submission.status === 'flagged' ? 'Unflag' : 'Flag'}
          </button>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Problem', value: question?.title || submission.questionId, mono: false },
          { label: 'Language', value: submission.language.toUpperCase(), mono: true },
          { label: 'Exec Time', value: `${submission.executionTime}ms`, mono: true },
          { label: 'Submitted', value: `${fmtDate(submission.submittedAt)} ${fmtTime(submission.submittedAt)}`, mono: false },
        ].map(item => (
          <div key={item.label} className={cn('rounded-xl p-3 border', isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50')}>
            <p className={cn('text-xs', isDark ? 'text-slate-500' : 'text-slate-400')}>{item.label}</p>
            <p className={cn('text-sm font-semibold mt-0.5 truncate', item.mono ? 'font-mono' : '', isDark ? 'text-white' : 'text-slate-900')}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Score + Plagiarism */}
      <div className="grid grid-cols-2 gap-4">
        {/* Score */}
        <div className={infoCls}>
          <div className="flex items-center justify-between mb-3">
            <h3 className={cn('text-xs font-bold uppercase tracking-wider', isDark ? 'text-slate-400' : 'text-slate-500')}>Score</h3>
            {editScore === null ? (
              <button onClick={() => setEditScore(submission.score)}
                className="text-xs text-violet-400 hover:text-violet-300 font-semibold">Edit</button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => setEditScore(null)}
                  className={cn('text-xs', isDark ? 'text-slate-500' : 'text-slate-400')}>Cancel</button>
                <button onClick={onSaveScore}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold">Save</button>
              </div>
            )}
          </div>
          {editScore !== null ? (
            <input
              type="number" min={0} max={100}
              value={editScore}
              onChange={e => setEditScore(Number(e.target.value))}
              className={cn(
                'w-full px-3 py-2 rounded-xl text-2xl font-black text-center outline-none border',
                isDark ? 'bg-white/5 border-white/10 text-white focus:border-violet-500' : 'bg-white border-slate-200 text-slate-900 focus:border-violet-500'
              )}
            />
          ) : (
            <div className="text-center">
              <p className={cn('text-4xl font-black', submission.score >= 90 ? 'text-emerald-400' : submission.score >= 70 ? 'text-amber-400' : 'text-red-400')}>
                {submission.score}
              </p>
              <p className={cn('text-sm', isDark ? 'text-slate-500' : 'text-slate-400')}>out of 100</p>
              <div className={cn('mt-2 h-2 rounded-full overflow-hidden', isDark ? 'bg-white/10' : 'bg-slate-100')}>
                <div className={cn('h-full rounded-full transition-all', submission.score >= 90 ? 'bg-emerald-500' : submission.score >= 70 ? 'bg-amber-500' : 'bg-red-500')}
                  style={{ width: `${submission.score}%` }} />
              </div>
            </div>
          )}
        </div>

        {/* Plagiarism */}
        <div className={infoCls}>
          <h3 className={cn('text-xs font-bold uppercase tracking-wider mb-3', isDark ? 'text-slate-400' : 'text-slate-500')}>Plagiarism Similarity</h3>
          <div className="text-center">
            <p className={cn('text-4xl font-black', submission.plagiarismScore > 60 ? 'text-red-400' : submission.plagiarismScore > 30 ? 'text-amber-400' : 'text-emerald-400')}>
              {submission.plagiarismScore}%
            </p>
            <p className={cn('text-sm', isDark ? 'text-slate-500' : 'text-slate-400')}>
              {submission.plagiarismScore > 60 ? '🔴 High Risk' : submission.plagiarismScore > 30 ? '🟡 Moderate' : '🟢 Low Risk'}
            </p>
            <div className={cn('mt-2 h-2 rounded-full overflow-hidden', isDark ? 'bg-white/10' : 'bg-slate-100')}>
              <div className={cn('h-full rounded-full transition-all', submission.plagiarismScore > 60 ? 'bg-red-500' : submission.plagiarismScore > 30 ? 'bg-amber-500' : 'bg-emerald-500')}
                style={{ width: `${submission.plagiarismScore}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Warnings / Violations */}
      {submission.warnings.length > 0 && (
        <div className={infoCls}>
          <h3 className={cn('text-xs font-bold uppercase tracking-wider mb-3', isDark ? 'text-slate-400' : 'text-slate-500')}>
            ⚠️ Violation Log ({submission.warnings.length})
          </h3>
          <div className="space-y-2">
            {submission.warnings.map((w, i) => (
              <div key={i} className={cn(
                'flex items-center justify-between px-3 py-2 rounded-xl text-xs border',
                isDark ? 'border-amber-500/20 bg-amber-500/5' : 'border-amber-200 bg-amber-50'
              )}>
                <div className="flex items-center gap-2">
                  <span>{w.type === 'tab_switch' ? '🔄' : w.type === 'blur' ? '👁' : w.type === 'inactivity' ? '😴' : '🖱'}</span>
                  <span className="text-amber-400 font-semibold capitalize">{w.type.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn(isDark ? 'text-slate-400' : 'text-slate-500')}>{fmtTime(w.timestamp)}</span>
                  <span className="text-amber-400 font-bold">×{w.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Output */}
      <div className={infoCls}>
        <h3 className={cn('text-xs font-bold uppercase tracking-wider mb-3', isDark ? 'text-slate-400' : 'text-slate-500')}>Output</h3>
        <pre className={cn(
          'text-xs font-mono p-3 rounded-xl border whitespace-pre-wrap',
          isDark ? 'bg-[#0a0f1e] border-white/10 text-emerald-400' : 'bg-slate-50 border-slate-200 text-emerald-600'
        )}>
          {submission.output || '(No output recorded)'}
        </pre>
      </div>

      {/* Code Viewer */}
      <div className={cn('rounded-2xl border overflow-hidden', isDark ? 'border-white/10' : 'border-slate-200')}>
        <div className={cn(
          'flex items-center justify-between px-5 py-3 border-b',
          isDark ? 'border-white/10 bg-[#161b22]' : 'border-slate-200 bg-slate-50'
        )}>
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            </div>
            <span className={cn('text-xs font-mono', isDark ? 'text-slate-400' : 'text-slate-500')}>
              solution.{submission.language === 'python' ? 'py' : submission.language === 'java' ? 'java' : submission.language === 'cpp' ? 'cpp' : 'c'}
            </span>
            <span className={cn('text-xs px-2 py-0.5 rounded font-mono', isDark ? 'bg-white/10 text-slate-300' : 'bg-slate-100 text-slate-600')}>
              {submission.language.toUpperCase()}
            </span>
            <span className={cn('text-xs', isDark ? 'text-slate-600' : 'text-slate-400')}>
              {submission.code.length} chars · {submission.code.split('\n').length} lines
            </span>
          </div>
          <button onClick={() => setShowCode(c => !c)}
            className={cn('text-xs font-medium transition-all', isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700')}>
            {showCode ? '▲ Hide' : '▼ Show'} Code
          </button>
        </div>

        {showCode && (
          <div className="flex overflow-auto max-h-96">
            {/* Line numbers */}
            <div className={cn(
              'flex-shrink-0 py-4 px-3 text-right select-none border-r',
              isDark ? 'bg-[#0d1117] text-slate-700 border-white/10' : 'bg-[#f6f8fa] text-slate-300 border-slate-200'
            )}
              style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', lineHeight: '1.7' }}>
              {submission.code.split('\n').map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            {/* Code */}
            <pre className={cn(
              'flex-1 py-4 px-4 text-xs font-mono whitespace-pre overflow-x-auto',
              isDark ? 'bg-[#0d1117] text-slate-300' : 'bg-white text-slate-700'
            )}
              style={{ fontFamily: 'JetBrains Mono, monospace', lineHeight: '1.7' }}>
              {submission.code}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
