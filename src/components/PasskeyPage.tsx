import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { cn } from '../utils/cn';

export function PasskeyPage() {
  const { verifyPasskey, setView, currentStudent, logout, theme } = useApp();
  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const isDark = theme === 'dark';

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (attempts >= 3) return;
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 600));
    const ok = verifyPasskey(passkey);
    if (ok) {
      setView('student');
    } else {
      setAttempts(a => a + 1);
      setError(`Invalid passkey. ${2 - attempts} attempts remaining. Ask your instructor.`);
      setPasskey('');
    }
    setLoading(false);
  };

  return (
    <div className={cn(
      'min-h-screen flex flex-col items-center justify-center relative overflow-hidden',
      isDark ? 'bg-[#0a0f1e]' : 'bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50'
    )}>
      <div className="absolute inset-0 pointer-events-none">
        <div className={cn('absolute top-1/4 left-1/4 w-80 h-80 rounded-full blur-3xl opacity-20 animate-pulse', isDark ? 'bg-amber-500' : 'bg-amber-300')} />
        <div className={cn('absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-20 animate-pulse delay-1000', isDark ? 'bg-orange-600' : 'bg-orange-300')} />
      </div>

      <div className="relative z-10 text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-2xl shadow-amber-500/40 mb-4">
          <span className="text-2xl">🔑</span>
        </div>
        <h2 className={cn('text-2xl font-black', isDark ? 'text-white' : 'text-slate-900')}>Key Verification</h2>
        <p className={cn('text-sm mt-1', isDark ? 'text-slate-400' : 'text-slate-500')}>
          Enter the competition passkey provided by your instructor
        </p>
      </div>

      <div className={cn(
        'relative z-10 w-full max-w-sm mx-4 rounded-3xl overflow-hidden shadow-2xl',
        isDark ? 'bg-white/5 backdrop-blur-2xl border border-white/10' : 'bg-white/80 backdrop-blur-2xl border border-amber-200/60'
      )}>
        {/* Student info bar */}
        <div className={cn('px-6 py-4 border-b', isDark ? 'border-white/10 bg-white/5' : 'border-amber-100 bg-amber-50/50')}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
              {currentStudent?.name.charAt(0)}
            </div>
            <div>
              <p className={cn('font-semibold text-sm', isDark ? 'text-white' : 'text-slate-900')}>{currentStudent?.name}</p>
              <p className={cn('text-xs', isDark ? 'text-slate-400' : 'text-slate-500')}>{currentStudent?.rollNo}</p>
            </div>
            <div className="ml-auto">
              <span className="px-2 py-1 rounded-lg bg-green-500/20 text-green-400 text-xs font-semibold">✓ Authenticated</span>
            </div>
          </div>
        </div>

        <div className="p-8">
          {attempts >= 3 ? (
            <div className="text-center space-y-4">
              <div className="text-5xl">🚫</div>
              <h3 className={cn('font-bold text-lg', isDark ? 'text-red-400' : 'text-red-600')}>Access Blocked</h3>
              <p className={cn('text-sm', isDark ? 'text-slate-400' : 'text-slate-500')}>
                Maximum attempts exceeded. Contact your instructor.
              </p>
              <button onClick={logout}
                className="w-full py-3 rounded-xl bg-red-500/20 text-red-400 font-semibold text-sm hover:bg-red-500/30 transition-all border border-red-500/20">
                ← Back to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleVerify} className="space-y-5">
              <div>
                <label className={cn('block text-xs font-semibold mb-2 uppercase tracking-wider', isDark ? 'text-slate-400' : 'text-slate-500')}>
                  Competition Passkey
                </label>
                <input
                  type="text" value={passkey} onChange={e => setPasskey(e.target.value.toUpperCase())}
                  placeholder="e.g. CSJMU@UIET4"
                  className={cn(
                    'w-full px-4 py-3.5 rounded-xl text-sm font-bold tracking-widest transition-all outline-none border text-center',
                    isDark
                      ? 'bg-white/5 border-white/10 text-amber-400 placeholder:text-slate-600 focus:border-amber-500 focus:bg-white/10'
                      : 'bg-white border-amber-200 text-amber-600 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
                  )}
                />
              </div>

              {attempts > 0 && (
                <div className={cn('flex items-center gap-2 text-xs', isDark ? 'text-slate-500' : 'text-slate-400')}>
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className={cn('w-2 h-2 rounded-full', i < attempts ? 'bg-red-500' : isDark ? 'bg-white/20' : 'bg-slate-200')} />
                  ))}
                  <span>{attempts}/3 attempts used</span>
                </div>
              )}

              {error && (
                <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  ⚠️ {error}
                </div>
              )}

              <button type="submit" disabled={loading || !passkey}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold text-sm hover:from-amber-500 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/30 disabled:opacity-40">
                {loading ? '⟳ Verifying...' : '🔓 Unlock Contest'}
              </button>

              <button type="button" onClick={logout}
                className={cn('w-full py-2.5 rounded-xl text-sm font-medium transition-all', isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600')}>
                ← Back to Login
              </button>
            </form>
          )}
        </div>
      </div>

      <div className={cn('relative z-10 mt-6 text-center text-xs', isDark ? 'text-slate-600' : 'text-slate-400')}>
        <p>🔐 Passkey is provided by your instructor before competition starts</p>
        <p className="mt-1">Demo passkey: <span className="font-mono font-bold text-amber-400">CSJMU@UIET4</span></p>
      </div>
    </div>
  );
}
