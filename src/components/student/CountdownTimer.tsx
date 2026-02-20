import { useApp } from '../../context/AppContext';
import { cn } from '../../utils/cn';

export function CountdownTimer() {
  const { contestTimeLeft, contestSettings, theme } = useApp();
  const isDark = theme === 'dark';

  const hours = Math.floor(contestTimeLeft / 3600);
  const minutes = Math.floor((contestTimeLeft % 3600) / 60);
  const seconds = contestTimeLeft % 60;

  const pad = (n: number) => String(n).padStart(2, '0');
  const totalDuration = contestSettings.durationMinutes * 60;
  const elapsed = totalDuration - contestTimeLeft;
  const pct = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));

  const urgency = contestTimeLeft < 300 ? 'critical' : contestTimeLeft < 900 ? 'warning' : 'normal';

  return (
    <div className={cn(
      'flex items-center gap-3 px-4 py-2 rounded-2xl border transition-all',
      urgency === 'critical'
        ? 'bg-red-500/10 border-red-500/30 animate-pulse'
        : urgency === 'warning'
          ? 'bg-amber-500/10 border-amber-500/30'
          : isDark ? 'bg-white/5 border-white/10' : 'bg-white/80 border-slate-200'
    )}>
      <div className={cn(
        'text-base',
        urgency === 'critical' ? 'text-red-400' : urgency === 'warning' ? 'text-amber-400' : 'text-violet-400'
      )}>⏱</div>

      <div className="flex flex-col">
        <div className={cn(
          'font-mono font-bold text-lg leading-none tracking-wider',
          urgency === 'critical' ? 'text-red-400' : urgency === 'warning' ? 'text-amber-400' : isDark ? 'text-white' : 'text-slate-900'
        )}>
          {pad(hours)}:{pad(minutes)}:{pad(seconds)}
        </div>
        <div className="mt-1 h-1 w-24 rounded-full overflow-hidden bg-white/10">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-1000',
              urgency === 'critical' ? 'bg-red-500' : urgency === 'warning' ? 'bg-amber-500' : 'bg-gradient-to-r from-violet-500 to-indigo-500'
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {urgency !== 'normal' && (
        <span className={cn(
          'text-xs font-semibold px-2 py-0.5 rounded-lg',
          urgency === 'critical' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
        )}>
          {urgency === 'critical' ? '🚨 HURRY' : '⚠️ SOON'}
        </span>
      )}
    </div>
  );
}
