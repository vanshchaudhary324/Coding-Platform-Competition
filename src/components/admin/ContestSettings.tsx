import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../utils/cn';

export function ContestSettings() {
  const { contestSettings, updateContestSettings, theme, contestTimeLeft } = useApp();
  const isDark = theme === 'dark';

  const [name, setName] = useState(contestSettings.name);
  const [durationMinutes, setDurationMinutes] = useState(contestSettings.durationMinutes);
  const [passKey, setPassKey] = useState(contestSettings.passKey);
  const [status, setStatus] = useState(contestSettings.status);
  const [saved, setSaved] = useState(false);
  const [addMinutes, setAddMinutes] = useState(10);

  const pad = (n: number) => String(n).padStart(2, '0');
  const hours = Math.floor(contestTimeLeft / 3600);
  const minutes = Math.floor((contestTimeLeft % 3600) / 60);
  const seconds = contestTimeLeft % 60;

  const totalDuration = contestSettings.durationMinutes * 60;
  const elapsed = totalDuration - contestTimeLeft;
  const progressPct = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));

  const handleSave = () => {
    updateContestSettings({
      name,
      durationMinutes: Number(durationMinutes),
      passKey: passKey.trim() || contestSettings.passKey,
      status,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleExtend = (mins: number) => {
    const newDuration = contestSettings.durationMinutes + mins;
    setDurationMinutes(newDuration);
    updateContestSettings({ durationMinutes: newDuration });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReduce = (mins: number) => {
    const newDuration = Math.max(1, contestSettings.durationMinutes - mins);
    setDurationMinutes(newDuration);
    updateContestSettings({ durationMinutes: newDuration });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    const newStartTime = Date.now();
    updateContestSettings({
      startTime: newStartTime,
      durationMinutes: Number(durationMinutes),
      name,
      passKey,
      status: 'active',
    });
    setStatus('active');
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const inputCls = cn(
    'w-full px-4 py-3 rounded-xl text-sm outline-none border transition-all',
    isDark
      ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-violet-500 focus:bg-white/10'
      : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10'
  );

  const labelCls = cn('block text-xs font-bold mb-2 uppercase tracking-wider', isDark ? 'text-slate-400' : 'text-slate-500');

  const presets = [30, 60, 90, 120, 150, 180];

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className={cn('text-2xl font-black', isDark ? 'text-white' : 'text-slate-900')}>
              ⚙️ Contest Settings
            </h2>
            <p className={cn('text-sm mt-1', isDark ? 'text-slate-400' : 'text-slate-500')}>
              Configure and control the live competition in real time
            </p>
          </div>
          {saved && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-semibold animate-pulse">
              ✓ Settings Applied!
            </div>
          )}
        </div>

        {/* Live Timer Card */}
        <div className={cn(
          'rounded-3xl p-6 border relative overflow-hidden',
          isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'
        )}>
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500" />
          <div className="flex items-center justify-between mb-4">
            <h3 className={cn('text-sm font-bold uppercase tracking-wider', isDark ? 'text-slate-400' : 'text-slate-500')}>
              🕐 Live Contest Timer
            </h3>
            <span className={cn(
              'text-xs font-semibold px-3 py-1 rounded-full border',
              contestSettings.status === 'active'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : contestSettings.status === 'upcoming'
                  ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                  : 'bg-red-500/10 border-red-500/20 text-red-400'
            )}>
              ● {contestSettings.status.toUpperCase()}
            </span>
          </div>

          {/* Big Timer */}
          <div className="text-center py-4">
            <div className={cn(
              'font-mono font-black text-6xl tracking-widest',
              contestTimeLeft < 300 ? 'text-red-400' : contestTimeLeft < 900 ? 'text-amber-400' : isDark ? 'text-white' : 'text-slate-900'
            )}>
              {pad(hours)}:{pad(minutes)}:{pad(seconds)}
            </div>
            <p className={cn('text-sm mt-2', isDark ? 'text-slate-400' : 'text-slate-500')}>
              Time Remaining / Total: <strong>{contestSettings.durationMinutes} min</strong>
            </p>
          </div>

          {/* Progress Bar */}
          <div className={cn('h-3 rounded-full overflow-hidden', isDark ? 'bg-white/10' : 'bg-slate-100')}>
            <div
              className={cn(
                'h-full rounded-full transition-all duration-1000',
                progressPct > 80 ? 'bg-gradient-to-r from-red-500 to-rose-500' :
                progressPct > 50 ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
                'bg-gradient-to-r from-violet-500 to-indigo-500'
              )}
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="flex justify-between mt-1 text-xs text-slate-500">
            <span>0 min</span>
            <span>{Math.round(contestSettings.durationMinutes / 2)} min</span>
            <span>{contestSettings.durationMinutes} min</span>
          </div>
        </div>

        {/* Quick Duration Controls */}
        <div className={cn('rounded-3xl p-6 border', isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white')}>
          <h3 className={cn('text-sm font-bold uppercase tracking-wider mb-5', isDark ? 'text-slate-400' : 'text-slate-500')}>
            ⚡ Quick Duration Controls
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Extend */}
            <div>
              <p className={cn('text-xs font-semibold mb-3', isDark ? 'text-slate-300' : 'text-slate-700')}>
                ➕ Extend Contest Duration
              </p>
              <div className="flex gap-2 flex-wrap">
                {[5, 10, 15, 20, 30].map(m => (
                  <button
                    key={m}
                    onClick={() => handleExtend(m)}
                    className={cn(
                      'px-4 py-2 rounded-xl text-sm font-bold transition-all border',
                      'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                    )}
                  >
                    +{m}m
                  </button>
                ))}
              </div>
              <div className="flex gap-2 mt-3">
                <input
                  type="number"
                  min={1}
                  max={180}
                  value={addMinutes}
                  onChange={e => setAddMinutes(Number(e.target.value))}
                  className={cn(
                    'w-24 px-3 py-2 rounded-xl text-sm outline-none border text-center font-mono',
                    isDark ? 'bg-white/5 border-white/10 text-white focus:border-emerald-500' : 'bg-white border-slate-200 text-slate-900 focus:border-emerald-500'
                  )}
                />
                <button
                  onClick={() => handleExtend(addMinutes)}
                  className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-bold hover:from-emerald-600 hover:to-teal-700 transition-all"
                >
                  ➕ Extend by {addMinutes} min
                </button>
              </div>
            </div>

            {/* Reduce */}
            <div>
              <p className={cn('text-xs font-semibold mb-3', isDark ? 'text-slate-300' : 'text-slate-700')}>
                ➖ Reduce Contest Duration
              </p>
              <div className="flex gap-2 flex-wrap">
                {[5, 10, 15, 20, 30].map(m => (
                  <button
                    key={m}
                    onClick={() => handleReduce(m)}
                    className={cn(
                      'px-4 py-2 rounded-xl text-sm font-bold transition-all border',
                      'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20'
                    )}
                  >
                    -{m}m
                  </button>
                ))}
              </div>
              <div className="flex gap-2 mt-3">
                <input
                  type="number"
                  min={1}
                  max={180}
                  value={addMinutes}
                  onChange={e => setAddMinutes(Number(e.target.value))}
                  className={cn(
                    'w-24 px-3 py-2 rounded-xl text-sm outline-none border text-center font-mono',
                    isDark ? 'bg-white/5 border-white/10 text-white focus:border-red-500' : 'bg-white border-slate-200 text-slate-900 focus:border-red-500'
                  )}
                />
                <button
                  onClick={() => handleReduce(addMinutes)}
                  className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white text-sm font-bold hover:from-red-600 hover:to-rose-700 transition-all"
                >
                  ➖ Reduce by {addMinutes} min
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Contest Configuration Form */}
        <div className={cn('rounded-3xl p-6 border space-y-5', isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white')}>
          <h3 className={cn('text-sm font-bold uppercase tracking-wider', isDark ? 'text-slate-400' : 'text-slate-500')}>
            📋 Contest Configuration
          </h3>

          {/* Contest Name */}
          <div>
            <label className={labelCls}>Contest Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. CSJMU UIET Annual Coding Championship"
              className={inputCls}
            />
          </div>

          {/* Duration + Presets */}
          <div>
            <label className={labelCls}>Total Duration (minutes)</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {presets.map(p => (
                <button
                  key={p}
                  onClick={() => setDurationMinutes(p)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-bold transition-all border',
                    durationMinutes === p
                      ? 'bg-violet-500/20 border-violet-500/30 text-violet-400'
                      : isDark ? 'border-white/10 text-slate-400 hover:bg-white/10' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  )}
                >
                  {p >= 60 ? `${p / 60}h` : `${p}m`} {p === 120 ? '(2h)' : ''}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <input
                type="number"
                min={1}
                max={480}
                value={durationMinutes}
                onChange={e => setDurationMinutes(Number(e.target.value))}
                className={cn(inputCls, 'font-mono text-lg font-bold text-center')}
                style={{ maxWidth: '140px' }}
              />
              <div className={cn('flex items-center px-4 py-3 rounded-xl border flex-1', isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50')}>
                <span className={cn('text-sm', isDark ? 'text-slate-400' : 'text-slate-500')}>
                  = <strong className={isDark ? 'text-white' : 'text-slate-900'}>{Math.floor(durationMinutes / 60)}h {durationMinutes % 60}m</strong> total contest time
                </span>
              </div>
            </div>
          </div>

          {/* Passkey */}
          <div>
            <label className={labelCls}>🔑 Contest Passkey (students enter this to join)</label>
            <input
              value={passKey}
              onChange={e => setPassKey(e.target.value.toUpperCase())}
              placeholder="e.g. CSJMU@UIET4"
              className={cn(inputCls, 'font-mono tracking-widest text-amber-400 text-center text-lg font-bold')}
            />
            <p className={cn('text-xs mt-1.5', isDark ? 'text-slate-600' : 'text-slate-400')}>
              Current active key: <span className="font-mono text-amber-400 font-semibold">{contestSettings.passKey}</span>
            </p>
          </div>

          {/* Contest Status */}
          <div>
            <label className={labelCls}>Contest Status</label>
            <div className="flex gap-3">
              {(['upcoming', 'active', 'ended'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={cn(
                    'flex-1 py-3 rounded-xl text-sm font-bold capitalize transition-all border',
                    status === s
                      ? s === 'active'
                        ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                        : s === 'upcoming'
                          ? 'bg-amber-500/20 border-amber-500/30 text-amber-400'
                          : 'bg-red-500/20 border-red-500/30 text-red-400'
                      : isDark ? 'border-white/10 text-slate-400 hover:bg-white/5' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  )}
                >
                  {s === 'active' ? '▶ Active' : s === 'upcoming' ? '⏳ Upcoming' : '■ Ended'}
                </button>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-black text-base hover:from-violet-600 hover:to-indigo-700 transition-all shadow-lg shadow-violet-500/30"
          >
            💾 Save & Apply Settings
          </button>
        </div>

        {/* Danger Zone */}
        <div className={cn('rounded-3xl p-6 border', isDark ? 'border-red-500/20 bg-red-500/5' : 'border-red-200 bg-red-50')}>
          <h3 className="text-sm font-bold uppercase tracking-wider text-red-400 mb-4">
            ⚠️ Danger Zone
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={cn('rounded-xl p-4 border', isDark ? 'border-red-500/20 bg-red-500/5' : 'border-red-200 bg-white')}>
              <p className={cn('text-sm font-semibold mb-1', isDark ? 'text-white' : 'text-slate-900')}>🔄 Restart Contest</p>
              <p className={cn('text-xs mb-3', isDark ? 'text-slate-400' : 'text-slate-500')}>
                Reset the start time to now. Duration stays as configured above. Students timer resets.
              </p>
              <button
                onClick={handleReset}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-bold hover:from-amber-600 hover:to-orange-700 transition-all"
              >
                🔄 Restart Timer Now
              </button>
            </div>
            <div className={cn('rounded-xl p-4 border', isDark ? 'border-red-500/20 bg-red-500/5' : 'border-red-200 bg-white')}>
              <p className={cn('text-sm font-semibold mb-1', isDark ? 'text-white' : 'text-slate-900')}>🛑 End Contest Now</p>
              <p className={cn('text-xs mb-3', isDark ? 'text-slate-400' : 'text-slate-500')}>
                Immediately set timer to 0. Auto-submits all active student sessions.
              </p>
              <button
                onClick={() => {
                  updateContestSettings({ durationMinutes: 0, status: 'ended' });
                  setDurationMinutes(0);
                  setStatus('ended');
                  setSaved(true);
                  setTimeout(() => setSaved(false), 3000);
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white text-sm font-bold hover:from-red-600 hover:to-rose-700 transition-all"
              >
                🛑 End Contest Now
              </button>
            </div>
          </div>
        </div>

        {/* Current Active Config Summary */}
        <div className={cn('rounded-3xl p-6 border', isDark ? 'border-white/10 bg-white/[0.02]' : 'border-slate-200 bg-white')}>
          <h3 className={cn('text-sm font-bold uppercase tracking-wider mb-4', isDark ? 'text-slate-400' : 'text-slate-500')}>
            📌 Active Configuration Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Contest Name', value: contestSettings.name, mono: false },
              { label: 'Duration', value: `${contestSettings.durationMinutes} min`, mono: true },
              { label: 'Passkey', value: contestSettings.passKey, mono: true },
              { label: 'Status', value: contestSettings.status.toUpperCase(), mono: false },
            ].map(item => (
              <div key={item.label} className={cn('rounded-xl p-3 border', isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50')}>
                <p className={cn('text-xs', isDark ? 'text-slate-500' : 'text-slate-400')}>{item.label}</p>
                <p className={cn(
                  'text-sm font-bold mt-0.5 truncate',
                  item.mono ? 'font-mono' : '',
                  item.label === 'Passkey' ? 'text-amber-400' :
                  item.label === 'Status' ? 'text-emerald-400' :
                  isDark ? 'text-white' : 'text-slate-900'
                )}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
