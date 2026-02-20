import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../utils/cn';
import type { Question } from '../../types';

const DIFF_COLOR = {
  Easy: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  Medium: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  Hard: 'text-red-400 bg-red-500/10 border-red-500/30',
};

const EMPTY_QUESTION: Omit<Question, 'id'> = {
  title: '',
  difficulty: 'Easy',
  description: '',
  constraints: [''],
  examples: [{ input: '', output: '', explanation: '' }],
  testCases: [{ input: '', expectedOutput: '' }],
  tags: [],
  keywords: [],
  timeLimit: 1000,
  memoryLimit: 256,
};

export function QuestionManager() {
  const { questions, setQuestions, theme } = useApp();
  const isDark = theme === 'dark';
  const [selected, setSelected] = useState<Question | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<Omit<Question, 'id'>>(EMPTY_QUESTION);
  const [search, setSearch] = useState('');
  const [filterDiff, setFilterDiff] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [importText, setImportText] = useState('');
  const [showImport, setShowImport] = useState(false);

  const filtered = questions.filter(q => {
    if (filterDiff !== 'All' && q.difficulty !== filterDiff) return false;
    if (search && !q.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleAdd = () => {
    setForm(EMPTY_QUESTION);
    setIsAdding(true);
    setIsEditing(false);
    setSelected(null);
  };

  const handleEdit = (q: Question) => {
    setForm({ ...q });
    setSelected(q);
    setIsEditing(true);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
    if (selected?.id === id) setSelected(null);
    setDeleteConfirm(null);
  };

  const handleSave = () => {
    if (!form.title.trim()) return;
    if (isAdding) {
      const newQ: Question = { ...form, id: `q${Date.now()}` };
      setQuestions(prev => [...prev, newQ]);
      setIsAdding(false);
    } else if (isEditing && selected) {
      setQuestions(prev => prev.map(q => q.id === selected.id ? { ...form, id: q.id } : q));
      setIsEditing(false);
      setSelected(null);
    }
  };

  const handleImport = () => {
    try {
      const data = JSON.parse(importText);
      const arr = Array.isArray(data) ? data : [data];
      const newQs: Question[] = arr.map((item: Omit<Question, 'id'>, i: number) => ({
        ...item,
        id: `imported_${Date.now()}_${i}`,
      }));
      setQuestions(prev => [...prev, ...newQs]);
      setShowImport(false);
      setImportText('');
      alert(`Successfully imported ${newQs.length} question(s)!`);
    } catch {
      alert('Invalid JSON format. Please check your input.');
    }
  };

  const isFormMode = isAdding || isEditing;

  return (
    <div className="h-full flex overflow-hidden">
      {/* Left: Question List */}
      <div className={cn('w-80 flex-shrink-0 flex flex-col border-r', isDark ? 'border-white/10' : 'border-slate-200')}>
        {/* Toolbar */}
        <div className={cn('p-3 border-b space-y-2 flex-shrink-0', isDark ? 'border-white/10' : 'border-slate-200')}>
          <div className="flex gap-2">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search questions..."
              className={cn(
                'flex-1 px-3 py-1.5 rounded-lg text-xs outline-none border',
                isDark ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-violet-500' : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-violet-500'
              )}
            />
            <button
              onClick={handleAdd}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-500 to-indigo-600 text-white text-xs font-bold hover:from-violet-600 hover:to-indigo-700 transition-all flex-shrink-0"
            >
              + Add
            </button>
          </div>
          <div className="flex gap-1">
            {(['All', 'Easy', 'Medium', 'Hard'] as const).map(d => (
              <button key={d} onClick={() => setFilterDiff(d)}
                className={cn(
                  'flex-1 py-1 rounded-lg text-xs font-medium transition-all',
                  filterDiff === d ? 'bg-violet-500/20 text-violet-400' : isDark ? 'text-slate-500 hover:bg-white/5' : 'text-slate-400 hover:bg-slate-100'
                )}>{d}</button>
            ))}
          </div>
          <button
            onClick={() => setShowImport(true)}
            className={cn(
              'w-full py-1.5 rounded-lg text-xs font-medium border transition-all',
              isDark ? 'border-white/10 text-slate-400 hover:bg-white/5' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
            )}
          >
            📥 Import JSON
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
          {filtered.length === 0 && (
            <div className="text-center text-slate-500 text-xs py-8">No questions found</div>
          )}
          {filtered.map(q => (
            <div
              key={q.id}
              onClick={() => { setSelected(q); setIsEditing(false); setIsAdding(false); }}
              className={cn(
                'group relative rounded-xl p-3 cursor-pointer border transition-all',
                selected?.id === q.id && !isFormMode
                  ? isDark ? 'bg-violet-500/10 border-violet-500/30' : 'bg-violet-50 border-violet-300'
                  : isDark ? 'border-white/5 hover:border-white/10 hover:bg-white/5' : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className={cn('text-xs font-semibold truncate', isDark ? 'text-white' : 'text-slate-900')}>{q.title}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className={cn('text-xs px-1.5 py-0.5 rounded border font-medium', DIFF_COLOR[q.difficulty])}>
                      {q.difficulty}
                    </span>
                    {q.tags.slice(0, 1).map(tag => (
                      <span key={tag} className={cn('text-xs px-1.5 py-0.5 rounded', isDark ? 'bg-white/10 text-slate-400' : 'bg-slate-100 text-slate-500')}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className={cn('text-xs mt-1', isDark ? 'text-slate-500' : 'text-slate-400')}>
                    {q.testCases.length} test cases · {q.timeLimit}ms
                  </p>
                </div>
                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  <button
                    onClick={e => { e.stopPropagation(); handleEdit(q); }}
                    className="p-1 rounded-lg bg-violet-500/20 text-violet-400 hover:bg-violet-500/30 text-xs"
                  >✏️</button>
                  <button
                    onClick={e => { e.stopPropagation(); setDeleteConfirm(q.id); }}
                    className="p-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 text-xs"
                  >🗑️</button>
                </div>
              </div>

              {/* Delete confirm */}
              {deleteConfirm === q.id && (
                <div className={cn(
                  'absolute inset-0 rounded-xl flex flex-col items-center justify-center gap-2 z-10',
                  isDark ? 'bg-[#0d1117]/95 border border-red-500/30' : 'bg-white/95 border border-red-300'
                )}>
                  <p className="text-xs text-red-400 font-semibold">Delete this question?</p>
                  <div className="flex gap-2">
                    <button
                      onClick={e => { e.stopPropagation(); setDeleteConfirm(null); }}
                      className={cn('px-3 py-1 rounded-lg text-xs', isDark ? 'bg-white/10 text-slate-300' : 'bg-slate-100 text-slate-600')}
                    >Cancel</button>
                    <button
                      onClick={e => { e.stopPropagation(); handleDelete(q.id); }}
                      className="px-3 py-1 rounded-lg text-xs bg-red-500/20 text-red-400 font-bold"
                    >Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={cn('px-3 py-2 border-t text-xs', isDark ? 'border-white/10 text-slate-600' : 'border-slate-200 text-slate-400')}>
          {filtered.length} of {questions.length} questions
        </div>
      </div>

      {/* Right: Detail / Form */}
      <div className="flex-1 overflow-y-auto">
        {/* Import Modal */}
        {showImport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowImport(false)} />
            <div className={cn(
              'relative z-10 w-full max-w-lg rounded-2xl p-6 space-y-4 border',
              isDark ? 'bg-[#0d1117] border-white/10' : 'bg-white border-slate-200'
            )}>
              <h3 className={cn('font-bold text-lg', isDark ? 'text-white' : 'text-slate-900')}>📥 Import Questions (JSON)</h3>
              <p className={cn('text-xs', isDark ? 'text-slate-400' : 'text-slate-500')}>
                Paste a JSON array of questions. Each object should have: title, difficulty, description, constraints[], examples[], testCases[], tags[], keywords[], timeLimit, memoryLimit.
              </p>
              <textarea
                value={importText}
                onChange={e => setImportText(e.target.value)}
                rows={10}
                placeholder={'[\n  {\n    "title": "Question Title",\n    "difficulty": "Easy",\n    ...\n  }\n]'}
                className={cn(
                  'w-full px-3 py-2.5 rounded-xl text-xs font-mono outline-none border resize-none',
                  isDark ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-violet-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-violet-500'
                )}
              />
              <div className="flex gap-3">
                <button onClick={() => setShowImport(false)}
                  className={cn('flex-1 py-2.5 rounded-xl text-sm border font-medium', isDark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500')}>
                  Cancel
                </button>
                <button onClick={handleImport}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 text-white text-sm font-bold">
                  Import
                </button>
              </div>
            </div>
          </div>
        )}

        {isFormMode ? (
          <QuestionForm
            form={form}
            setForm={setForm}
            onSave={handleSave}
            onCancel={() => { setIsAdding(false); setIsEditing(false); }}
            isAdding={isAdding}
            isDark={isDark}
          />
        ) : selected ? (
          <QuestionDetail question={selected} onEdit={() => handleEdit(selected)} isDark={isDark} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="text-5xl mb-4">📝</div>
            <h3 className={cn('text-lg font-bold mb-2', isDark ? 'text-white' : 'text-slate-900')}>Question Manager</h3>
            <p className={cn('text-sm mb-6', isDark ? 'text-slate-400' : 'text-slate-500')}>
              Select a question to view details, or add a new one.
            </p>
            <button onClick={handleAdd}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 text-white font-bold text-sm hover:from-violet-600 hover:to-indigo-700 transition-all">
              + Add New Question
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function QuestionDetail({ question, onEdit, isDark }: { question: Question; onEdit: () => void; isDark: boolean }) {
  const q = question;
  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={cn('text-xs font-bold px-2 py-0.5 rounded-lg border', DIFF_COLOR[q.difficulty])}>
              {q.difficulty}
            </span>
            {q.tags.map(t => (
              <span key={t} className={cn('text-xs px-2 py-0.5 rounded-lg', isDark ? 'bg-white/10 text-slate-300' : 'bg-slate-100 text-slate-600')}>
                {t}
              </span>
            ))}
          </div>
          <h2 className={cn('text-2xl font-black', isDark ? 'text-white' : 'text-slate-900')}>{q.title}</h2>
          <p className={cn('text-xs mt-1 font-mono', isDark ? 'text-slate-500' : 'text-slate-400')}>
            ID: {q.id} · {q.timeLimit}ms · {q.memoryLimit}MB
          </p>
        </div>
        <button onClick={onEdit}
          className="px-4 py-2 rounded-xl bg-violet-500/20 text-violet-400 border border-violet-500/30 text-sm font-semibold hover:bg-violet-500/30 transition-all">
          ✏️ Edit
        </button>
      </div>

      <SectionCard title="Description" isDark={isDark}>
        <p className={cn('text-sm leading-relaxed', isDark ? 'text-slate-300' : 'text-slate-700')}>{q.description}</p>
      </SectionCard>

      <SectionCard title={`Examples (${q.examples.length})`} isDark={isDark}>
        <div className="space-y-3">
          {q.examples.map((ex, i) => (
            <div key={i} className={cn('rounded-xl p-3 border', isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50')}>
              <p className={cn('text-xs font-semibold mb-1', isDark ? 'text-slate-400' : 'text-slate-500')}>Example {i + 1}</p>
              <div className="space-y-1 text-xs">
                <div><span className={isDark ? 'text-slate-500' : 'text-slate-400'}>Input: </span><code className={cn('px-1.5 py-0.5 rounded font-mono', isDark ? 'bg-white/10 text-violet-300' : 'bg-violet-50 text-violet-700')}>{ex.input}</code></div>
                <div><span className={isDark ? 'text-slate-500' : 'text-slate-400'}>Output: </span><code className={cn('px-1.5 py-0.5 rounded font-mono', isDark ? 'bg-white/10 text-emerald-300' : 'bg-emerald-50 text-emerald-700')}>{ex.output}</code></div>
                {ex.explanation && <p className={cn('italic', isDark ? 'text-slate-500' : 'text-slate-400')}>Explanation: {ex.explanation}</p>}
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="grid grid-cols-2 gap-4">
        <SectionCard title={`Constraints (${q.constraints.length})`} isDark={isDark}>
          <ul className="space-y-1">
            {q.constraints.map((c, i) => (
              <li key={i} className="flex gap-2 text-xs">
                <span className="text-violet-400">▸</span>
                <code className={cn('font-mono', isDark ? 'text-slate-300' : 'text-slate-600')}>{c}</code>
              </li>
            ))}
          </ul>
        </SectionCard>
        <SectionCard title={`Test Cases (${q.testCases.length})`} isDark={isDark}>
          <div className="space-y-2">
            {q.testCases.map((tc, i) => (
              <div key={i} className={cn('text-xs rounded-lg p-2 font-mono', isDark ? 'bg-white/5' : 'bg-slate-50')}>
                <div><span className={isDark ? 'text-slate-500' : 'text-slate-400'}>In: </span><span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{tc.input}</span></div>
                <div><span className={isDark ? 'text-slate-500' : 'text-slate-400'}>Exp: </span><span className="text-emerald-400">{tc.expectedOutput}</span></div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Keywords (for validation)" isDark={isDark}>
        <div className="flex flex-wrap gap-2">
          {q.keywords.map(kw => (
            <span key={kw} className={cn('text-xs px-2 py-0.5 rounded-lg font-mono border', isDark ? 'border-white/10 bg-white/5 text-slate-300' : 'border-slate-200 bg-slate-100 text-slate-600')}>
              {kw}
            </span>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function SectionCard({ title, children, isDark }: { title: string; children: React.ReactNode; isDark: boolean }) {
  return (
    <div className={cn('rounded-2xl p-5 border', isDark ? 'border-white/10 bg-white/[0.02]' : 'border-slate-200 bg-white')}>
      <h3 className={cn('text-xs font-bold uppercase tracking-wider mb-3', isDark ? 'text-slate-400' : 'text-slate-500')}>{title}</h3>
      {children}
    </div>
  );
}

function QuestionForm({
  form, setForm, onSave, onCancel, isAdding, isDark
}: {
  form: Omit<Question, 'id'>;
  setForm: React.Dispatch<React.SetStateAction<Omit<Question, 'id'>>>;
  onSave: () => void;
  onCancel: () => void;
  isAdding: boolean;
  isDark: boolean;
}) {
  const inputCls = cn(
    'w-full px-3 py-2.5 rounded-xl text-sm outline-none border transition-all',
    isDark
      ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-violet-500 focus:bg-white/10'
      : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10'
  );
  const labelCls = cn('block text-xs font-semibold mb-1.5 uppercase tracking-wider', isDark ? 'text-slate-400' : 'text-slate-500');

  const updateConstraint = (i: number, val: string) => {
    const arr = [...form.constraints];
    arr[i] = val;
    setForm(f => ({ ...f, constraints: arr }));
  };

  const updateExample = (i: number, field: keyof typeof form.examples[0], val: string) => {
    const arr = [...form.examples];
    arr[i] = { ...arr[i], [field]: val };
    setForm(f => ({ ...f, examples: arr }));
  };

  const updateTestCase = (i: number, field: keyof typeof form.testCases[0], val: string) => {
    const arr = [...form.testCases];
    arr[i] = { ...arr[i], [field]: val };
    setForm(f => ({ ...f, testCases: arr }));
  };

  return (
    <div className="p-6 max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={cn('text-xl font-black', isDark ? 'text-white' : 'text-slate-900')}>
          {isAdding ? '+ Add New Question' : '✏️ Edit Question'}
        </h2>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className={cn('px-4 py-2 rounded-xl text-sm font-medium border transition-all', isDark ? 'border-white/10 text-slate-400 hover:bg-white/5' : 'border-slate-200 text-slate-500 hover:bg-slate-50')}>
            Cancel
          </button>
          <button onClick={onSave}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 text-white text-sm font-bold hover:from-violet-600 hover:to-indigo-700 transition-all">
            {isAdding ? '+ Save Question' : '💾 Save Changes'}
          </button>
        </div>
      </div>

      {/* Basic Info */}
      <div className={cn('rounded-2xl p-5 border space-y-4', isDark ? 'border-white/10 bg-white/[0.02]' : 'border-slate-200 bg-white')}>
        <h3 className={cn('text-xs font-bold uppercase tracking-wider', isDark ? 'text-slate-400' : 'text-slate-500')}>Basic Info</h3>
        <div>
          <label className={labelCls}>Title</label>
          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="e.g. Two Sum" className={inputCls} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Difficulty</label>
            <select value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value as Question['difficulty'] }))}
              className={inputCls}>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Time Limit (ms)</label>
            <input type="number" value={form.timeLimit} onChange={e => setForm(f => ({ ...f, timeLimit: Number(e.target.value) }))}
              className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Memory Limit (MB)</label>
            <input type="number" value={form.memoryLimit} onChange={e => setForm(f => ({ ...f, memoryLimit: Number(e.target.value) }))}
              className={inputCls} />
          </div>
        </div>
        <div>
          <label className={labelCls}>Tags (comma-separated)</label>
          <input value={form.tags.join(', ')} onChange={e => setForm(f => ({ ...f, tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
            placeholder="Array, Hash Table" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Keywords for Validation (comma-separated)</label>
          <input value={form.keywords.join(', ')} onChange={e => setForm(f => ({ ...f, keywords: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
            placeholder="sum, array, indices" className={inputCls} />
        </div>
      </div>

      {/* Description */}
      <div className={cn('rounded-2xl p-5 border', isDark ? 'border-white/10 bg-white/[0.02]' : 'border-slate-200 bg-white')}>
        <label className={labelCls}>Problem Description</label>
        <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          rows={5} placeholder="Describe the problem clearly..."
          className={cn(inputCls, 'resize-none')} />
      </div>

      {/* Constraints */}
      <div className={cn('rounded-2xl p-5 border space-y-3', isDark ? 'border-white/10 bg-white/[0.02]' : 'border-slate-200 bg-white')}>
        <div className="flex items-center justify-between">
          <h3 className={cn('text-xs font-bold uppercase tracking-wider', isDark ? 'text-slate-400' : 'text-slate-500')}>Constraints</h3>
          <button onClick={() => setForm(f => ({ ...f, constraints: [...f.constraints, ''] }))}
            className="text-xs text-violet-400 hover:text-violet-300 font-semibold">+ Add</button>
        </div>
        {form.constraints.map((c, i) => (
          <div key={i} className="flex gap-2">
            <input value={c} onChange={e => updateConstraint(i, e.target.value)}
              placeholder={`Constraint ${i + 1}`} className={cn(inputCls, 'flex-1')} />
            <button onClick={() => setForm(f => ({ ...f, constraints: f.constraints.filter((_, j) => j !== i) }))}
              className="px-2 rounded-xl text-red-400 hover:bg-red-500/10 text-sm">✕</button>
          </div>
        ))}
      </div>

      {/* Examples */}
      <div className={cn('rounded-2xl p-5 border space-y-3', isDark ? 'border-white/10 bg-white/[0.02]' : 'border-slate-200 bg-white')}>
        <div className="flex items-center justify-between">
          <h3 className={cn('text-xs font-bold uppercase tracking-wider', isDark ? 'text-slate-400' : 'text-slate-500')}>Examples</h3>
          <button onClick={() => setForm(f => ({ ...f, examples: [...f.examples, { input: '', output: '', explanation: '' }] }))}
            className="text-xs text-violet-400 hover:text-violet-300 font-semibold">+ Add</button>
        </div>
        {form.examples.map((ex, i) => (
          <div key={i} className={cn('rounded-xl p-3 border space-y-2', isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50')}>
            <div className="flex justify-between items-center">
              <span className={cn('text-xs font-semibold', isDark ? 'text-slate-400' : 'text-slate-500')}>Example {i + 1}</span>
              <button onClick={() => setForm(f => ({ ...f, examples: f.examples.filter((_, j) => j !== i) }))}
                className="text-red-400 text-xs">✕</button>
            </div>
            <input value={ex.input} onChange={e => updateExample(i, 'input', e.target.value)} placeholder="Input" className={inputCls} />
            <input value={ex.output} onChange={e => updateExample(i, 'output', e.target.value)} placeholder="Output" className={inputCls} />
            <input value={ex.explanation || ''} onChange={e => updateExample(i, 'explanation', e.target.value)} placeholder="Explanation (optional)" className={inputCls} />
          </div>
        ))}
      </div>

      {/* Test Cases */}
      <div className={cn('rounded-2xl p-5 border space-y-3', isDark ? 'border-white/10 bg-white/[0.02]' : 'border-slate-200 bg-white')}>
        <div className="flex items-center justify-between">
          <h3 className={cn('text-xs font-bold uppercase tracking-wider', isDark ? 'text-slate-400' : 'text-slate-500')}>Test Cases</h3>
          <button onClick={() => setForm(f => ({ ...f, testCases: [...f.testCases, { input: '', expectedOutput: '' }] }))}
            className="text-xs text-violet-400 hover:text-violet-300 font-semibold">+ Add</button>
        </div>
        {form.testCases.map((tc, i) => (
          <div key={i} className={cn('rounded-xl p-3 border space-y-2', isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50')}>
            <div className="flex justify-between items-center">
              <span className={cn('text-xs font-semibold', isDark ? 'text-slate-400' : 'text-slate-500')}>Test Case {i + 1}</span>
              <button onClick={() => setForm(f => ({ ...f, testCases: f.testCases.filter((_, j) => j !== i) }))}
                className="text-red-400 text-xs">✕</button>
            </div>
            <input value={tc.input} onChange={e => updateTestCase(i, 'input', e.target.value)} placeholder="Input" className={inputCls} />
            <input value={tc.expectedOutput} onChange={e => updateTestCase(i, 'expectedOutput', e.target.value)} placeholder="Expected Output" className={inputCls} />
          </div>
        ))}
      </div>
    </div>
  );
}
