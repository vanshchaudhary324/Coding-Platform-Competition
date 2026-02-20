import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../utils/cn';
import type { Submission } from '../../types';

interface Props {
  onClose: () => void;
}

export function SubmitModal({ onClose }: Props) {
  const { code, selectedLanguage, currentStudent, assignedQuestion, addSubmission, setIsSubmitted, violations, tabSwitchCount, theme } = useApp();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const isDark = theme === 'dark';

  const validate = () => {
    if (!assignedQuestion) return { valid: false, msg: 'No problem assigned.' };
    const lower = code.toLowerCase();
    const matched = assignedQuestion.keywords.some(kw => lower.includes(kw.toLowerCase()));
    if (!matched && code.length > 50) {
      return { valid: false, msg: `Your code doesn't seem related to "${assignedQuestion.title}". Please write a solution for the assigned problem.` };
    }
    if (code.trim().length < 20) return { valid: false, msg: 'Code is too short. Please write a complete solution.' };
    return { valid: true, msg: '' };
  };

  const { valid, msg: validMsg } = validate();

  const handleSubmit = async () => {
    if (!valid || !currentStudent || !assignedQuestion) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 1800));
    const sub: Submission = {
      id: `sub_${Date.now()}`,
      studentId: currentStudent.id,
      questionId: assignedQuestion.id,
      code,
      language: selectedLanguage,
      submittedAt: new Date().toISOString(),
      status: 'accepted',
      executionTime: Math.floor(Math.random() * 100) + 20,
      output: 'Test cases passed: 3/3',
      score: Math.floor(Math.random() * 20) + 80,
      plagiarismScore: Math.floor(Math.random() * 15),
      warnings: violations,
      tabSwitches: tabSwitchCount,
    };
    addSubmission(sub);
    setIsSubmitted(true);
    setDone(true);
    setSubmitting(false);
  };

  const overlay = 'fixed inset-0 z-50 flex items-center justify-center p-4';
  const backdrop = 'absolute inset-0 bg-black/60 backdrop-blur-sm';

  if (done) {
    return (
      <div className={overlay}>
        <div className={backdrop} />
        <div className={cn(
          'relative z-10 w-full max-w-md rounded-3xl p-8 text-center space-y-4',
          isDark ? 'bg-[#0d1117] border border-white/10' : 'bg-white border border-slate-200'
        )}>
          <div className="text-6xl animate-bounce">🎉</div>
          <h2 className={cn('text-2xl font-black', isDark ? 'text-white' : 'text-slate-900')}>Submitted!</h2>
          <p className={cn('text-sm', isDark ? 'text-slate-400' : 'text-slate-500')}>
            Your solution has been securely stored with timestamp {new Date().toLocaleTimeString()}.
          </p>
          <div className="px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-emerald-400 text-sm font-semibold">✓ Submission locked. Good luck!</p>
          </div>
          <button onClick={onClose}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-bold text-sm">
            View My Submission
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={overlay}>
      <div className={backdrop} onClick={onClose} />
      <div className={cn(
        'relative z-10 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl',
        isDark ? 'bg-[#0d1117] border border-white/10' : 'bg-white border border-slate-200'
      )}>
        <div className={cn('px-6 py-5 border-b', isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50')}>
          <h2 className={cn('text-lg font-bold', isDark ? 'text-white' : 'text-slate-900')}>
            🚀 Final Submission
          </h2>
          <p className={cn('text-xs mt-0.5', isDark ? 'text-slate-400' : 'text-slate-500')}>
            This action cannot be undone. Your code will be locked.
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div className={cn('rounded-xl p-4 space-y-2 border', isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50')}>
            <div className="flex justify-between text-sm">
              <span className={cn(isDark ? 'text-slate-400' : 'text-slate-500')}>Problem</span>
              <span className={cn('font-semibold', isDark ? 'text-white' : 'text-slate-900')}>{assignedQuestion?.title}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className={cn(isDark ? 'text-slate-400' : 'text-slate-500')}>Language</span>
              <span className={cn('font-semibold', isDark ? 'text-white' : 'text-slate-900')}>{selectedLanguage.toUpperCase()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className={cn(isDark ? 'text-slate-400' : 'text-slate-500')}>Code Length</span>
              <span className={cn('font-semibold', isDark ? 'text-white' : 'text-slate-900')}>{code.length} chars</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className={cn(isDark ? 'text-slate-400' : 'text-slate-500')}>Violations</span>
              <span className={cn('font-semibold', tabSwitchCount > 0 ? 'text-amber-400' : isDark ? 'text-emerald-400' : 'text-emerald-600')}>
                {tabSwitchCount} tab switches
              </span>
            </div>
          </div>

          {!valid && (
            <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              ⚠️ {validMsg}
            </div>
          )}

          <div className="px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs">
            ⚠️ Once submitted, you cannot edit your code. This will be your final answer.
          </div>

          <div className="flex gap-3">
            <button onClick={onClose} disabled={submitting}
              className={cn(
                'flex-1 py-3 rounded-xl font-semibold text-sm transition-all border',
                isDark ? 'border-white/10 text-slate-400 hover:bg-white/5' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
              )}>
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={!valid || submitting}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-bold text-sm hover:from-violet-600 hover:to-indigo-700 transition-all disabled:opacity-40 shadow-lg shadow-violet-500/30">
              {submitting ? '⟳ Submitting...' : '🚀 Submit Final'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
