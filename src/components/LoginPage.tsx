import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { cn } from '../utils/cn';

export function LoginPage() {
  const { login, setView, theme, toggleTheme, adminLogin } = useApp();
  const [tab, setTab] = useState<'student' | 'admin'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 800));
    if (!email.trim()) { setError('Please enter your email address.'); setLoading(false); return; }
    if (password.trim().length < 4) { setError('Password must be at least 4 characters.'); setLoading(false); return; }
    const success = login(email, password);
    if (success) {
      setView('passkey');
    } else {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 800));
    const success = adminLogin(adminUser, adminPass);
    if (success) {
      setView('admin');
    } else {
      setError('Invalid credentials. Use admin / ADMIN001');
    }
    setLoading(false);
  };

  const isDark = theme === 'dark';

  return (
    <div className={cn(
      'min-h-screen flex flex-col items-center justify-center relative overflow-hidden transition-all duration-500',
      isDark ? 'bg-[#0a0f1e]' : 'bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100'
    )}>
      {/* Animated BG */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={cn('absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-30 animate-pulse', isDark ? 'bg-violet-600' : 'bg-violet-300')} />
        <div className={cn('absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse delay-1000', isDark ? 'bg-blue-600' : 'bg-blue-300')} />
        <div className={cn('absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-10', isDark ? 'bg-indigo-500' : 'bg-indigo-200')} />
      </div>

      {/* Theme Toggle */}
      <button onClick={toggleTheme} className={cn(
        'absolute top-6 right-6 p-2.5 rounded-xl transition-all',
        isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-black/10 text-slate-700 hover:bg-black/20'
      )}>
        {isDark ? '☀️' : '🌙'}
      </button>

      {/* Logo / Header */}
      <div className="relative z-10 text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-2xl shadow-violet-500/40 mb-4">
          <span className="text-2xl">⚡</span>
        </div>
        <h1 className={cn('text-3xl font-black tracking-tight', isDark ? 'text-white' : 'text-slate-900')}>
          Code<span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Arena</span>
        </h1>
        <p className={cn('text-sm mt-1 font-medium', isDark ? 'text-slate-400' : 'text-slate-500')}>
          CSJMU UIET University Coding Competition Platform
        </p>
      </div>

      {/* Card */}
      <div className={cn(
        'relative z-10 w-full max-w-md mx-4 rounded-3xl overflow-hidden shadow-2xl',
        isDark ? 'bg-white/5 backdrop-blur-2xl border border-white/10' : 'bg-white/80 backdrop-blur-2xl border border-white/60 shadow-slate-200/50'
      )}>
        {/* Tabs */}
        <div className={cn('flex border-b', isDark ? 'border-white/10' : 'border-slate-200')}>
          {(['student', 'admin'] as const).map(t => (
            <button key={t} onClick={() => { setTab(t); setError(''); }}
              className={cn(
                'flex-1 py-4 text-sm font-semibold capitalize transition-all',
                tab === t
                  ? 'bg-gradient-to-r from-violet-500/20 to-indigo-500/20 text-violet-400 border-b-2 border-violet-400'
                  : isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'
              )}>
              {t === 'student' ? '🎓 Student Login' : '🛡️ Admin Panel'}
            </button>
          ))}
        </div>

        <div className="p-8">
          {tab === 'student' ? (
            <form onSubmit={handleStudentLogin} className="space-y-5">
              <div>
                <label className={cn('block text-xs font-semibold mb-2 uppercase tracking-wider', isDark ? 'text-slate-400' : 'text-slate-500')}>
                  Email Address (Gmail / University)
                </label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="yourname@gmail.com or roll@csjmu.ac.in"
                  className={cn(
                    'w-full px-4 py-3 rounded-xl text-sm font-medium transition-all outline-none border',
                    isDark
                      ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-violet-500 focus:bg-white/10'
                      : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20'
                  )}
                />
              </div>
              <div>
                <label className={cn('block text-xs font-semibold mb-2 uppercase tracking-wider', isDark ? 'text-slate-400' : 'text-slate-500')}>
                  Password
                </label>
                <input
                  type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={cn(
                    'w-full px-4 py-3 rounded-xl text-sm font-medium transition-all outline-none border',
                    isDark
                      ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-violet-500 focus:bg-white/10'
                      : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20'
                  )}
                />
              </div>
              {error && (
                <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  ⚠️ {error}
                </div>
              )}
              <button type="submit" disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-bold text-sm hover:from-violet-600 hover:to-indigo-700 transition-all shadow-lg shadow-violet-500/30 disabled:opacity-50">
                {loading ? '⟳ Authenticating...' : '→ Enter Competition'}
              </button>
              <p className={cn('text-center text-xs', isDark ? 'text-slate-600' : 'text-slate-400')}>
                Use your Gmail or university email · any password (min 4 chars)
              </p>
            </form>
          ) : (
            <form onSubmit={handleAdminLogin} className="space-y-5">
              <div>
                <label className={cn('block text-xs font-semibold mb-2 uppercase tracking-wider', isDark ? 'text-slate-400' : 'text-slate-500')}>
                  Admin Username
                </label>
                <input
                  type="text" value={adminUser} onChange={e => setAdminUser(e.target.value)}
                  placeholder="admin"
                  className={cn(
                    'w-full px-4 py-3 rounded-xl text-sm font-medium transition-all outline-none border',
                    isDark
                      ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-violet-500'
                      : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20'
                  )}
                />
              </div>
              <div>
                <label className={cn('block text-xs font-semibold mb-2 uppercase tracking-wider', isDark ? 'text-slate-400' : 'text-slate-500')}>
                  Password
                </label>
                <input
                  type="password" value={adminPass} onChange={e => setAdminPass(e.target.value)}
                  placeholder="admin123"
                  className={cn(
                    'w-full px-4 py-3 rounded-xl text-sm font-medium transition-all outline-none border',
                    isDark
                      ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-violet-500'
                      : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20'
                  )}
                />
              </div>
              {error && (
                <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  ⚠️ {error}
                </div>
              )}
              <button type="submit" disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/30 disabled:opacity-50">
                {loading ? '⟳ Verifying...' : '→ Access Dashboard'}
              </button>
              <p className={cn('text-center text-xs', isDark ? 'text-slate-600' : 'text-slate-400')}>
                Username: <span className="font-mono text-amber-400">admin</span> &nbsp;·&nbsp; Password: <span className="font-mono text-amber-400">ADMIN001</span>
              </p>
            </form>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className={cn('relative z-10 mt-8 text-center text-xs', isDark ? 'text-slate-600' : 'text-slate-400')}>
        <p>🔒 Secured Platform · CSJMU UIET · v2.4.1</p>
        <p className="mt-1">Supports 200+ concurrent students with real-time monitoring</p>
      </div>
    </div>
  );
}
