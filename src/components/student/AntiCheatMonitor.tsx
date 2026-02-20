import { useEffect, useState, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../utils/cn';

interface WarningPopup {
  id: number;
  msg: string;
  type: string;
}

export function AntiCheatMonitor() {
  const { addViolation, violations, tabSwitchCount, warningCount, isSubmitted, theme } = useApp();
  const [popups, setPopups] = useState<WarningPopup[]>([]);
  const [inactivityTimer, setInactivityTimer] = useState(0);
  const isDark = theme === 'dark';

  const triggerWarning = useCallback((msg: string, type: Parameters<typeof addViolation>[0]) => {
    if (isSubmitted) return;
    addViolation(type);
    const id = Date.now();
    setPopups(prev => [...prev.slice(-2), { id, msg, type }]);
    setTimeout(() => {
      setPopups(prev => prev.filter(p => p.id !== id));
    }, 5000);
  }, [isSubmitted, addViolation]);

  useEffect(() => {
    if (isSubmitted) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerWarning('Tab switch detected! Stay on the competition window.', 'tab_switch');
      }
    };

    const handleBlur = () => {
      triggerWarning('Window focus lost! Return to the exam immediately.', 'blur');
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      triggerWarning('Right-click is disabled during the contest.', 'right_click');
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Block common cheat keys
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        e.preventDefault();
        triggerWarning('Developer tools are disabled during the contest.', 'right_click');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSubmitted, triggerWarning]);

  useEffect(() => {
    if (isSubmitted) return;
    let inactiveCount = 0;

    const interval = setInterval(() => {
      inactiveCount++;
      setInactivityTimer(inactiveCount);
      if (inactiveCount > 0 && inactiveCount % 300 === 0) {
        triggerWarning('Inactivity detected! Please continue working on your solution.', 'inactivity');
      }
    }, 1000);

    const resetTimer = () => {
      inactiveCount = 0;
      setInactivityTimer(0);
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('click', resetTimer);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('click', resetTimer);
    };
  }, [isSubmitted, triggerWarning]);

  const getPopupIcon = (type: string) => {
    switch (type) {
      case 'tab_switch': return '🔄';
      case 'blur': return '👁️';
      case 'inactivity': return '😴';
      case 'right_click': return '🖱️';
      default: return '⚠️';
    }
  };

  return (
    <>
      {/* ====== FULL-SCREEN WARNING POPUPS ====== */}
      {popups.length > 0 && !isSubmitted && (
        <div className="fixed inset-0 z-[9999] pointer-events-none flex flex-col items-center justify-start pt-20 gap-3 px-4">
          {popups.map((popup, idx) => (
            <div
              key={popup.id}
              className="pointer-events-auto w-full max-w-lg animate-bounce"
              style={{ animationDuration: '0.5s', animationIterationCount: 3 }}
            >
              <div className={cn(
                'relative rounded-2xl px-6 py-4 shadow-2xl border flex items-start gap-4',
                'bg-red-600 border-red-400 text-white',
                idx === 0 ? 'scale-100' : 'scale-95 opacity-90'
              )}>
                {/* Pulsing ring */}
                <div className="absolute inset-0 rounded-2xl border-2 border-red-300 animate-ping opacity-30" />

                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">
                  {getPopupIcon(popup.type)}
                </div>

                <div className="flex-1">
                  <p className="font-black text-base leading-tight">🚨 ANTI-CHEAT WARNING</p>
                  <p className="text-sm mt-1 text-red-100 font-medium">{popup.msg}</p>
                  <p className="text-xs mt-1 text-red-200">
                    This violation has been logged and reported to the administrator.
                  </p>
                </div>

                <div className="flex-shrink-0 text-right">
                  <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-lg">
                    Warning #{warningCount}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Darkening overlay on first warning */}
      {popups.length > 0 && !isSubmitted && (
        <div className="fixed inset-0 z-[9998] bg-red-900/20 pointer-events-none animate-pulse" />
      )}

      {/* ====== STATUS STRIP IN HEADER ====== */}
      <div className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-xl border text-xs flex-shrink-0',
        warningCount > 5
          ? 'border-red-500/40 bg-red-500/10'
          : warningCount > 2
            ? 'border-amber-500/40 bg-amber-500/10'
            : isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'
      )}>
        <div className="flex items-center gap-1.5">
          <span className={cn(
            'w-2 h-2 rounded-full',
            warningCount > 5 ? 'bg-red-500 animate-pulse' :
            warningCount > 2 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
          )} />
          <span className="font-bold" style={{
            color: warningCount > 5 ? '#f87171' : warningCount > 2 ? '#fbbf24' : '#10b981'
          }}>
            🛡 AntiCheat
          </span>
        </div>

        <div className={cn('w-px h-3', isDark ? 'bg-white/10' : 'bg-slate-300')} />

        <span className={cn(tabSwitchCount > 0 ? 'text-red-400 font-bold' : isDark ? 'text-slate-500' : 'text-slate-400')}>
          🔄 {tabSwitchCount} switch{tabSwitchCount !== 1 ? 'es' : ''}
        </span>

        <span className={cn(
          'font-semibold',
          warningCount > 5 ? 'text-red-400' : warningCount > 2 ? 'text-amber-400' : isDark ? 'text-slate-500' : 'text-slate-400'
        )}>
          ⚠️ {warningCount} warn{warningCount !== 1 ? 'ings' : 'ing'}
        </span>

        {inactivityTimer > 60 && !isSubmitted && (
          <span className="text-amber-500 font-mono ml-1">
            😴 {Math.floor(inactivityTimer / 60)}:{String(inactivityTimer % 60).padStart(2, '0')}
          </span>
        )}

        {violations.map(v => (
          <span key={v.type} className={cn('hidden lg:inline', isDark ? 'text-slate-600' : 'text-slate-400')}>
            {v.type === 'tab_switch' ? '🔄' :
             v.type === 'blur' ? '👁' :
             v.type === 'inactivity' ? '😴' : '🖱'} ×{v.count}
          </span>
        ))}
      </div>
    </>
  );
}
