import { useState, useRef, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../utils/cn';
import type { Language } from '../../types';

const LANG_CONFIG: Record<Language, { label: string; icon: string; color: string; ext: string }> = {
  c: { label: 'C', icon: '🔵', color: 'text-blue-400', ext: '.c' },
  cpp: { label: 'C++', icon: '🟦', color: 'text-cyan-400', ext: '.cpp' },
  python: { label: 'Python', icon: '🐍', color: 'text-yellow-400', ext: '.py' },
  java: { label: 'Java', icon: '☕', color: 'text-orange-400', ext: '.java' },
};

const KEYWORDS: Record<Language, string[]> = {
  c: ['#include', 'int', 'void', 'char', 'printf', 'scanf', 'return', 'main', 'for', 'while', 'if', 'else'],
  cpp: ['#include', 'using', 'namespace', 'std', 'int', 'void', 'cout', 'cin', 'return', 'main', 'class', 'vector', 'map', 'string', 'for', 'while', 'if', 'else', 'auto'],
  python: ['def', 'class', 'import', 'from', 'return', 'if', 'elif', 'else', 'for', 'while', 'in', 'print', 'input', 'range', 'len', 'and', 'or', 'not', 'True', 'False', 'None'],
  java: ['public', 'class', 'static', 'void', 'main', 'String', 'int', 'System', 'out', 'println', 'import', 'java', 'Scanner', 'new', 'return', 'if', 'else', 'for', 'while'],
};

function highlightCode(code: string, lang: Language): string {
  const kws = KEYWORDS[lang];
  let result = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Comments
  result = result.replace(/(\/\/[^\n]*)/g, '<span class="text-slate-500 italic">$1</span>');
  result = result.replace(/(#[^\n]*)/g, lang === 'python' || lang === 'c' || lang === 'cpp'
    ? '<span class="text-slate-500 italic">$1</span>'
    : '$1');

  // Strings
  result = result.replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g, '<span class="text-emerald-400">$1</span>');

  // Numbers
  result = result.replace(/\b(\d+\.?\d*)\b/g, '<span class="text-amber-400">$1</span>');

  // Keywords
  kws.forEach(kw => {
    const re = new RegExp(`\\b(${kw})\\b`, 'g');
    result = result.replace(re, '<span class="text-violet-400 font-semibold">$1</span>');
  });

  return result;
}

export function CodeEditor() {
  const { code, setCode, selectedLanguage, setSelectedLanguage, isSubmitted, theme, runCode, isRunning, runResult } = useApp();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [showOutput, setShowOutput] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isDark = theme === 'dark';
  const lineCount = code.split('\n').length;

  const handleTab = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = textareaRef.current!;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);
      setTimeout(() => { ta.selectionStart = ta.selectionEnd = start + 2; }, 0);
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      const ta = textareaRef.current!;
      const start = ta.selectionStart;
      const lineStart = code.lastIndexOf('\n', start - 1) + 1;
      const currentLine = code.substring(lineStart, start);
      const indentMatch = currentLine.match(/^(\s*)/);
      const indent = indentMatch ? indentMatch[1] : '';
      const newCode = code.substring(0, start) + '\n' + indent + code.substring(start);
      setCode(newCode);
      setTimeout(() => { ta.selectionStart = ta.selectionEnd = start + 1 + indent.length; }, 0);
    }
  }, [code, setCode]);

  const handleRun = () => {
    setShowOutput(true);
    runCode();
  };

  return (
    <div className={cn(
      'flex flex-col rounded-2xl overflow-hidden border transition-all',
      isFullscreen ? 'fixed inset-2 z-50 shadow-2xl' : 'h-full',
      isDark ? 'border-white/10 bg-[#0d1117]' : 'border-slate-200 bg-white'
    )}>
      {/* Editor Toolbar */}
      <div className={cn(
        'flex items-center justify-between px-4 py-2.5 border-b flex-shrink-0',
        isDark ? 'border-white/10 bg-[#161b22]' : 'border-slate-200 bg-slate-50'
      )}>
        <div className="flex items-center gap-2">
          {/* Window dots */}
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
          </div>
          <span className={cn('text-xs font-mono ml-2', isDark ? 'text-slate-500' : 'text-slate-400')}>
            solution{LANG_CONFIG[selectedLanguage].ext}
          </span>
          {!isSubmitted && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-green-500/10 text-green-500 font-medium">● Autosaved</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <div className="flex gap-1">
            {(Object.keys(LANG_CONFIG) as Language[]).map(lang => (
              <button key={lang} onClick={() => !isSubmitted && setSelectedLanguage(lang)}
                disabled={isSubmitted}
                className={cn(
                  'px-2.5 py-1 rounded-lg text-xs font-bold transition-all',
                  selectedLanguage === lang
                    ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                    : isDark ? 'text-slate-500 hover:text-slate-300 hover:bg-white/5' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                )}>
                {LANG_CONFIG[lang].icon} {LANG_CONFIG[lang].label}
              </button>
            ))}
          </div>

          <div className={cn('w-px h-4', isDark ? 'bg-white/10' : 'bg-slate-200')} />

          <div className="flex items-center gap-1">
            <button onClick={() => setFontSize(f => Math.max(11, f - 1))}
              className={cn('w-6 h-6 rounded text-xs flex items-center justify-center', isDark ? 'text-slate-400 hover:bg-white/10' : 'text-slate-500 hover:bg-slate-100')}>
              A
            </button>
            <span className={cn('text-xs w-6 text-center', isDark ? 'text-slate-500' : 'text-slate-400')}>{fontSize}</span>
            <button onClick={() => setFontSize(f => Math.min(20, f + 1))}
              className={cn('w-6 h-6 rounded text-sm flex items-center justify-center', isDark ? 'text-slate-400 hover:bg-white/10' : 'text-slate-500 hover:bg-slate-100')}>
              A
            </button>
          </div>

          <button onClick={() => setIsFullscreen(f => !f)}
            className={cn('p-1.5 rounded-lg text-xs transition-all', isDark ? 'text-slate-400 hover:bg-white/10' : 'text-slate-500 hover:bg-slate-100')}>
            {isFullscreen ? '⊠' : '⛶'}
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Line Numbers */}
        <div className={cn(
          'flex-shrink-0 py-4 px-3 text-right select-none overflow-hidden',
          isDark ? 'bg-[#0d1117] text-slate-700' : 'bg-[#f6f8fa] text-slate-300'
        )}
          style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: `${fontSize}px`, lineHeight: '1.6' }}>
          {[...Array(lineCount)].map((_, i) => (
            <div key={i} className="leading-[1.6]">{i + 1}</div>
          ))}
        </div>

        {/* Editor Area */}
        <div className="flex-1 relative overflow-auto">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={e => !isSubmitted && setCode(e.target.value)}
            onKeyDown={handleTab}
            disabled={isSubmitted}
            spellCheck={false}
            className={cn(
              'absolute inset-0 w-full h-full resize-none outline-none bg-transparent caret-violet-400 p-4 z-10',
              isSubmitted ? 'opacity-60 cursor-not-allowed' : '',
              isDark ? 'text-transparent selection:bg-violet-500/30' : 'text-transparent selection:bg-violet-500/20'
            )}
            style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: `${fontSize}px`, lineHeight: '1.6', color: 'transparent' }}
          />
          <div
            className={cn('absolute inset-0 p-4 pointer-events-none overflow-auto', isDark ? 'text-slate-300' : 'text-slate-700')}
            style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: `${fontSize}px`, lineHeight: '1.6', whiteSpace: 'pre' }}
            dangerouslySetInnerHTML={{ __html: highlightCode(code, selectedLanguage) }}
          />
        </div>
      </div>

      {/* Stats Bar */}
      <div className={cn(
        'flex items-center justify-between px-4 py-1.5 text-xs border-t flex-shrink-0',
        isDark ? 'border-white/10 bg-[#161b22] text-slate-600' : 'border-slate-200 bg-slate-50 text-slate-400'
      )}>
        <div className="flex items-center gap-4">
          <span>Lines: {lineCount}</span>
          <span>Chars: {code.length}</span>
          <span className={LANG_CONFIG[selectedLanguage].color}>{LANG_CONFIG[selectedLanguage].label}</span>
        </div>
        <div className="flex items-center gap-2">
          {isSubmitted && <span className="text-emerald-400 font-semibold">✓ Submitted — Read Only</span>}
        </div>
      </div>

      {/* Run Controls */}
      <div className={cn(
        'flex items-center gap-2 px-4 py-3 border-t flex-shrink-0',
        isDark ? 'border-white/10 bg-[#161b22]' : 'border-slate-200 bg-slate-50'
      )}>
        <button
          onClick={handleRun}
          disabled={isRunning || isSubmitted}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-sm font-semibold hover:bg-emerald-500/30 transition-all disabled:opacity-40">
          {isRunning ? <span className="animate-spin">⟳</span> : '▶'} {isRunning ? 'Running...' : 'Run Code'}
        </button>

        <button onClick={() => setShowOutput(o => !o)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all border',
            isDark ? 'border-white/10 text-slate-400 hover:bg-white/5' : 'border-slate-200 text-slate-500 hover:bg-slate-100'
          )}>
          {showOutput ? '▲ Hide' : '▼ Output'}
        </button>

        {runResult && (
          <span className={cn(
            'ml-auto text-xs font-semibold px-2.5 py-1 rounded-lg',
            runResult.status === 'success'
              ? 'bg-emerald-500/10 text-emerald-400'
              : 'bg-red-500/10 text-red-400'
          )}>
            {runResult.status === 'success' ? `✓ ${runResult.executionTime}ms` : '✗ Error'}
          </span>
        )}
      </div>

      {/* Output Panel */}
      {showOutput && (
        <div className={cn(
          'border-t flex-shrink-0 max-h-48 overflow-auto',
          isDark ? 'border-white/10 bg-[#0a0f1e]' : 'border-slate-200 bg-slate-50'
        )}>
          <div className={cn('flex items-center gap-2 px-4 py-2 border-b', isDark ? 'border-white/10' : 'border-slate-200')}>
            <span className="text-xs font-semibold text-slate-500">OUTPUT</span>
            {runResult && (
              <span className="text-xs text-slate-600">· {runResult.executionTime}ms</span>
            )}
          </div>
          <div className="p-4" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px' }}>
            {isRunning ? (
              <span className="text-slate-500 animate-pulse">⟳ Executing in sandbox...</span>
            ) : runResult ? (
              <>
                {runResult.output && <pre className={cn('whitespace-pre-wrap', isDark ? 'text-emerald-400' : 'text-emerald-600')}>{runResult.output}</pre>}
                {runResult.error && <pre className="whitespace-pre-wrap text-red-400">{runResult.error}</pre>}
              </>
            ) : (
              <span className="text-slate-600">Run your code to see output here...</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
