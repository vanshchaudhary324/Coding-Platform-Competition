export type AppView = 'login' | 'passkey' | 'student' | 'admin';
export type Theme = 'dark' | 'light';

export interface Student {
  id: string;
  name: string;
  rollNo: string;
  branch: string;
  competition: string;
  email: string;
  password: string;
  assignedQuestionId: string;
  loginTime: string;
  ip: string;
  device: string;
  status: 'active' | 'idle' | 'submitted' | 'offline';
}

export interface Question {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  constraints: string[];
  examples: { input: string; output: string; explanation?: string }[];
  testCases: { input: string; expectedOutput: string }[];
  tags: string[];
  keywords: string[];
  timeLimit: number;
  memoryLimit: number;
}

export interface Submission {
  id: string;
  studentId: string;
  questionId: string;
  code: string;
  language: string;
  submittedAt: string;
  status: 'pending' | 'accepted' | 'wrong_answer' | 'runtime_error' | 'time_limit' | 'flagged';
  executionTime: number;
  output: string;
  score: number;
  plagiarismScore: number;
  warnings: ViolationLog[];
  tabSwitches: number;
}

export interface ViolationLog {
  type: 'tab_switch' | 'blur' | 'inactivity' | 'copy_paste' | 'right_click';
  timestamp: string;
  count: number;
}

export interface ActiveStudent {
  student: Student;
  submission?: Submission;
  tabSwitches: number;
  warnings: number;
  lastActivity: string;
  language: string;
  currentStatus: string;
  codeLength: number;
}

export interface Contest {
  id: string;
  name: string;
  duration: number;
  startTime: string;
  passKey: string;
  status: 'upcoming' | 'active' | 'ended';
}

export type Language = 'c' | 'cpp' | 'python' | 'java';

export interface RunResult {
  output: string;
  error: string;
  executionTime: number;
  status: 'success' | 'error' | 'timeout';
}
