import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { AppView, Theme, Student, Question, Submission, ViolationLog, Language } from '../types';
import { QUESTIONS, STUDENTS, MOCK_SUBMISSIONS, CONTEST, DEFAULT_CODE } from '../data/mockData';

// Admin credentials — configurable (case-insensitive username, exact password)
const ADMIN_CREDENTIALS = [
  { username: 'admin', password: 'ADMIN001' },
  { username: 'admin', password: 'admin123' },
  { username: 'admin', password: 'Admin@123' },
  { username: 'admin', password: 'admin@123' },
  { username: 'administrator', password: 'ADMIN001' },
];

interface ContestSettings {
  name: string;
  durationMinutes: number;
  startTime: number; // ms timestamp
  passKey: string;
  status: 'upcoming' | 'active' | 'ended';
}

interface AppContextType {
  theme: Theme;
  toggleTheme: () => void;
  view: AppView;
  setView: (v: AppView) => void;
  currentStudent: Student | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  verifyPasskey: (key: string) => boolean;
  assignedQuestion: Question | null;
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  submissions: Submission[];
  addSubmission: (sub: Submission) => void;
  updateSubmission: (id: string, updates: Partial<Submission>) => void;
  selectedLanguage: Language;
  setSelectedLanguage: (l: Language) => void;
  code: string;
  setCode: (c: string) => void;
  isSubmitted: boolean;
  setIsSubmitted: (v: boolean) => void;
  violations: ViolationLog[];
  addViolation: (type: ViolationLog['type']) => void;
  tabSwitchCount: number;
  warningCount: number;
  runResult: { output: string; error: string; executionTime: number; status: string } | null;
  setRunResult: (r: AppContextType['runResult']) => void;
  runCode: () => void;
  isRunning: boolean;
  contestTimeLeft: number;
  contestSettings: ContestSettings;
  updateContestSettings: (s: Partial<ContestSettings>) => void;
  isAdmin: boolean;
  adminLogin: (u: string, p: string) => boolean;
  students: Student[];
  contest: typeof CONTEST;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [view, setView] = useState<AppView>('login');
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [questions, setQuestions] = useState<Question[]>(QUESTIONS);
  const [submissions, setSubmissions] = useState<Submission[]>(MOCK_SUBMISSIONS);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('cpp');
  const [code, setCode] = useState(DEFAULT_CODE['cpp']);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [violations, setViolations] = useState<ViolationLog[]>([]);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [warningCount, setWarningCount] = useState(0);
  const [runResult, setRunResult] = useState<AppContextType['runResult']>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [students] = useState<Student[]>(STUDENTS);

  const [contestSettings, setContestSettings] = useState<ContestSettings>({
    name: CONTEST.name,
    durationMinutes: Math.floor(CONTEST.duration / 60),
    startTime: new Date(CONTEST.startTime).getTime(),
    passKey: CONTEST.passKey,
    status: 'active',
  });

  const contestEndTime = contestSettings.startTime + contestSettings.durationMinutes * 60 * 1000;
  const [contestTimeLeft, setContestTimeLeft] = useState(
    Math.max(0, Math.floor((contestEndTime - Date.now()) / 1000))
  );

  // Keep ref so interval always reads latest endTime
  const endTimeRef = useRef(contestEndTime);
  useEffect(() => {
    endTimeRef.current = contestEndTime;
    // Recalculate immediately when duration changes
    setContestTimeLeft(Math.max(0, Math.floor((contestEndTime - Date.now()) / 1000)));
  }, [contestEndTime]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  useEffect(() => {
    const interval = setInterval(() => {
      const left = Math.max(0, Math.floor((endTimeRef.current - Date.now()) / 1000));
      setContestTimeLeft(left);
      if (left === 0 && !isSubmitted && view === 'student') {
        setIsSubmitted(true);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted, view]);

  useEffect(() => {
    if (selectedLanguage) {
      setCode(DEFAULT_CODE[selectedLanguage]);
    }
  }, [selectedLanguage]);

  const login = useCallback((email: string, password: string): boolean => {
    // First check existing students
    const existingStudent = STUDENTS.find(
      s => s.email.toLowerCase() === email.toLowerCase() && s.password === password
    );
    if (existingStudent) {
      setCurrentStudent(existingStudent);
      return true;
    }

    // Allow ANY email + password (min 4 chars) — dynamic registration
    if (email.trim() && password.trim().length >= 4) {
      // Derive name from email prefix
      const emailPrefix = email.split('@')[0];
      const nameParts = emailPrefix.replace(/[._\-0-9]/g, ' ').trim().split(' ').filter(Boolean);
      const derivedName = nameParts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ') || emailPrefix;

      // Determine branch from email domain
      const domain = email.split('@')[1] || '';
      const branch = domain.includes('csjmu') ? 'Computer Science' :
                     domain.includes('gmail') ? 'Computer Science' :
                     domain.includes('cs') ? 'Computer Science' :
                     domain.includes('it') ? 'Information Technology' : 'Computer Science';

      // Assign random question
      const randomQuestion = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];

      const dynamicStudent = {
        id: `dynamic_${Date.now()}`,
        name: derivedName,
        rollNo: `UIET/CS/2024/${String(Math.floor(Math.random() * 900) + 100)}`,
        branch,
        competition: 'CSJMU Annual',
        email: email.trim().toLowerCase(),
        password: password,
        assignedQuestionId: randomQuestion.id,
        loginTime: new Date().toISOString(),
        ip: `192.168.1.${Math.floor(Math.random() * 200) + 50}`,
        device: navigator.userAgent.includes('Chrome') ? 'Chrome/Windows' :
                navigator.userAgent.includes('Firefox') ? 'Firefox/Linux' :
                navigator.userAgent.includes('Safari') ? 'Safari/Mac' : 'Browser/Unknown',
        status: 'active' as const,
      };
      setCurrentStudent(dynamicStudent);
      return true;
    }

    return false;
  }, []);

  const logout = useCallback(() => {
    setCurrentStudent(null);
    setView('login');
    setIsAdmin(false);
    setIsSubmitted(false);
    setViolations([]);
    setTabSwitchCount(0);
    setWarningCount(0);
  }, []);

  const verifyPasskey = useCallback((key: string): boolean => {
    return key.trim().toUpperCase() === contestSettings.passKey.trim().toUpperCase();
  }, [contestSettings.passKey]);

  const adminLogin = useCallback((u: string, p: string): boolean => {
    const match = ADMIN_CREDENTIALS.some(
      cred => cred.username.toLowerCase() === u.toLowerCase() && cred.password === p
    );
    if (match) {
      setIsAdmin(true);
      return true;
    }
    return false;
  }, []);

  const updateContestSettings = useCallback((updates: Partial<ContestSettings>) => {
    setContestSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const addSubmission = useCallback((sub: Submission) => {
    setSubmissions(prev => [...prev, sub]);
  }, []);

  const updateSubmission = useCallback((id: string, updates: Partial<Submission>) => {
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, []);

  const addViolation = useCallback((type: ViolationLog['type']) => {
    setViolations(prev => {
      const existing = prev.find(v => v.type === type);
      if (existing) {
        return prev.map(v => v.type === type ? { ...v, count: v.count + 1, timestamp: new Date().toISOString() } : v);
      }
      return [...prev, { type, timestamp: new Date().toISOString(), count: 1 }];
    });
    if (type === 'tab_switch') setTabSwitchCount(c => c + 1);
    setWarningCount(c => c + 1);
  }, []);

  const runCode = useCallback(() => {
    setIsRunning(true);
    setRunResult(null);
    setTimeout(() => {
      const lang = selectedLanguage;
      const outputs: Record<string, string> = {
        cpp: '// Program executed successfully\n[0, 1]\n[1, 2]\n[0, 1]',
        python: '# Program executed successfully\n[0, 1]\n[1, 2]\n[0, 1]',
        java: '// Program executed successfully\n[0, 1]',
        c: '// Program executed successfully\n0 1',
      };
      const hasError = code.includes('syntaxError') || code.length < 20;
      setRunResult({
        output: hasError ? '' : outputs[lang] || 'Output: Success',
        error: hasError ? `Error: Compilation failed\nline 1: unexpected token` : '',
        executionTime: Math.floor(Math.random() * 80) + 20,
        status: hasError ? 'error' : 'success',
      });
      setIsRunning(false);
    }, 1500);
  }, [code, selectedLanguage]);

  const assignedQuestion = currentStudent
    ? questions.find(q => q.id === currentStudent.assignedQuestionId) || null
    : null;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <AppContext.Provider value={{
      theme, toggleTheme, view, setView, currentStudent, login, logout,
      verifyPasskey, assignedQuestion, questions, setQuestions,
      submissions, addSubmission, updateSubmission,
      selectedLanguage, setSelectedLanguage, code, setCode,
      isSubmitted, setIsSubmitted, violations, addViolation,
      tabSwitchCount, warningCount, runResult, setRunResult,
      runCode, isRunning, contestTimeLeft,
      contestSettings, updateContestSettings,
      isAdmin, adminLogin, students, contest: CONTEST,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
