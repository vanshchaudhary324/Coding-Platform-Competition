import { useApp } from '../../context/AppContext';
import { cn } from '../../utils/cn';

const DIFF_COLOR = {
  Easy: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  Medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  Hard: 'text-red-400 bg-red-500/10 border-red-500/20',
};

export function ProblemPanel() {
  const { assignedQuestion, theme } = useApp();
  const isDark = theme === 'dark';

  if (!assignedQuestion) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500">
        No problem assigned
      </div>
    );
  }

  const q = assignedQuestion;

  return (
    <div className={cn(
      'h-full overflow-y-auto rounded-2xl border',
      isDark ? 'border-white/10 bg-white/[0.02]' : 'border-slate-200 bg-white'
    )}>
      {/* Problem Header */}
      <div className={cn(
        'sticky top-0 px-5 py-4 border-b z-10',
        isDark ? 'border-white/10 bg-[#0d1117]/90 backdrop-blur-xl' : 'border-slate-200 bg-white/90 backdrop-blur-xl'
      )}>
        <div className="flex items-start gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={cn('text-xs font-bold px-2 py-0.5 rounded-lg border', DIFF_COLOR[q.difficulty])}>
                {q.difficulty}
              </span>
              {q.tags.map(tag => (
                <span key={tag} className={cn('text-xs px-2 py-0.5 rounded-lg', isDark ? 'bg-white/5 text-slate-400' : 'bg-slate-100 text-slate-500')}>
                  {tag}
                </span>
              ))}
            </div>
            <h2 className={cn('text-lg font-bold', isDark ? 'text-white' : 'text-slate-900')}>{q.title}</h2>
          </div>
          <div className="ml-auto text-right">
            <div className={cn('text-xs', isDark ? 'text-slate-500' : 'text-slate-400')}>Time / Memory</div>
            <div className={cn('text-xs font-semibold font-mono', isDark ? 'text-slate-300' : 'text-slate-600')}>
              {q.timeLimit}ms / {q.memoryLimit}MB
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 py-5 space-y-6">
        {/* Description */}
        <div>
          <p className={cn('text-sm leading-relaxed', isDark ? 'text-slate-300' : 'text-slate-700')}>
            {q.description}
          </p>
        </div>

        {/* Examples */}
        <div>
          <h3 className={cn('text-xs font-bold uppercase tracking-wider mb-3', isDark ? 'text-slate-400' : 'text-slate-500')}>
            Examples
          </h3>
          <div className="space-y-3">
            {q.examples.map((ex, i) => (
              <div key={i} className={cn(
                'rounded-xl overflow-hidden border',
                isDark ? 'border-white/10' : 'border-slate-200'
              )}>
                <div className={cn('px-3 py-1.5 text-xs font-semibold', isDark ? 'bg-white/5 text-slate-400' : 'bg-slate-50 text-slate-500')}>
                  Example {i + 1}
                </div>
                <div className="p-3 space-y-2">
                  <div>
                    <span className={cn('text-xs font-semibold', isDark ? 'text-slate-500' : 'text-slate-400')}>Input: </span>
                    <code className={cn(
                      'text-xs px-2 py-0.5 rounded font-mono',
                      isDark ? 'bg-white/5 text-violet-300' : 'bg-violet-50 text-violet-700'
                    )}>{ex.input}</code>
                  </div>
                  <div>
                    <span className={cn('text-xs font-semibold', isDark ? 'text-slate-500' : 'text-slate-400')}>Output: </span>
                    <code className={cn(
                      'text-xs px-2 py-0.5 rounded font-mono',
                      isDark ? 'bg-white/5 text-emerald-300' : 'bg-emerald-50 text-emerald-700'
                    )}>{ex.output}</code>
                  </div>
                  {ex.explanation && (
                    <p className={cn('text-xs italic', isDark ? 'text-slate-500' : 'text-slate-400')}>
                      Explanation: {ex.explanation}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Constraints */}
        <div>
          <h3 className={cn('text-xs font-bold uppercase tracking-wider mb-3', isDark ? 'text-slate-400' : 'text-slate-500')}>
            Constraints
          </h3>
          <ul className="space-y-1.5">
            {q.constraints.map((c, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-violet-400 text-xs mt-0.5 flex-shrink-0">▸</span>
                <code className={cn('text-xs font-mono', isDark ? 'text-slate-300' : 'text-slate-600')}>{c}</code>
              </li>
            ))}
          </ul>
        </div>

        {/* Test Cases */}
        <div>
          <h3 className={cn('text-xs font-bold uppercase tracking-wider mb-3', isDark ? 'text-slate-400' : 'text-slate-500')}>
            Test Cases ({q.testCases.length} hidden)
          </h3>
          <div className={cn(
            'px-4 py-3 rounded-xl text-xs',
            isDark ? 'bg-white/5 text-slate-500 border border-white/10' : 'bg-slate-50 text-slate-400 border border-slate-200'
          )}>
            🔒 Test cases are evaluated automatically upon submission. Make sure your code handles all edge cases.
          </div>
        </div>
      </div>
    </div>
  );
}
