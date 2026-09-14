'use client';

import { useEffect, useMemo, useState } from 'react';
import './notes.css';

const seedNotes = [
  { id: 'n1', title: 'Rajasthan Water Security', body: 'Integrated water security needs watershed restoration, demand management, reuse, and climate-resilient agriculture.\n\nKey ideas\n- Treat water as a basin-level system.\n- Connect science, institutions and citizen behaviour.\n- Use treated wastewater for non-potable demand.\n\n[[Balotra textile cluster]] shows why industrial policy, river ecology and technology must be studied together.', tags: ['RAS', 'Environment', 'Rajasthan'], folder: 'Study', pinned: true, updated: 'Today' },
  { id: 'n2', title: 'Civil Services Interview — Multidisciplinary Thinking', body: 'A strong administrator does not solve a problem through one discipline alone. A river pollution case can involve chemistry, microbiology, economics, law, policing, behaviour and technology.\n\nInterview frame: define the problem → map stakeholders → use evidence → design policy → measure outcomes.', tags: ['Interview', 'PSIR'], folder: 'Study', pinned: false, updated: 'Yesterday' },
  { id: 'n3', title: 'Personal OS Ideas', body: 'Build one calm command centre for notes, learning, tasks, calendar and reflection.\n\nAI should understand context, not just generate text. Notes should be structured enough to become flashcards, questions, plans and knowledge graphs.', tags: ['Productivity', 'AI'], folder: 'Ideas', pinned: false, updated: 'Sep 12' },
  { id: 'n4', title: 'Physics — Electromagnetic Induction', body: 'Faraday\'s law: induced emf is proportional to the negative rate of change of magnetic flux.\n\nConnect the equation to intuition: changing flux → electric field → current when a conducting path exists.', tags: ['Physics'], folder: 'Study', pinned: false, updated: 'Sep 11' },
];

const icons = {
  search: <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>,
  plus: <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>,
  spark: <svg viewBox="0 0 24 24"><path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3ZM19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z"/></svg>,
  pin: <svg viewBox="0 0 24 24"><path d="m14 4 6 6-3 1-3 5-2-2-5 3 3-5-2-2 5-3 1-3Z"/></svg>,
  archive: <svg viewBox="0 0 24 24"><path d="M4 7h16M6 7v12h12V7M8 4h8l1 3H7l1-3ZM9 11h6"/></svg>,
  trash: <svg viewBox="0 0 24 24"><path d="M5 7h14M10 11v6M14 11v6M9 7V4h6v3m-9 0 1 14h10l1-14"/></svg>,
  chevron: <svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>,
  menu: <svg viewBox="0 0 24 24"><path d="M5 7h14M5 12h14M5 17h14"/></svg>,
};

function Icon({ name }) { return <span className="icon">{icons[name]}</span>; }

export default function NotesPage() {
  const [notes, setNotes] = useState(seedNotes);
  const [activeId, setActiveId] = useState('n1');
  const [query, setQuery] = useState('');
  const [folder, setFolder] = useState('All notes');
  const [aiOpen, setAiOpen] = useState(true);
  const [aiInput, setAiInput] = useState('');
  const [aiMessage, setAiMessage] = useState('Ask me to summarize, connect, quiz, rewrite, or extract actions from this note.');
  const [saved, setSaved] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('vk-notes-v1');
      if (stored) setNotes(JSON.parse(stored));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem('vk-notes-v1', JSON.stringify(notes));
    setSaved(true);
  }, [notes]);

  const active = notes.find(n => n.id === activeId) || notes[0];
  const folders = ['All notes', 'Study', 'Ideas', 'Projects', 'Archive'];
  const filtered = useMemo(() => notes.filter(n => {
    const inFolder = folder === 'All notes' || n.folder === folder;
    const text = `${n.title} ${n.body} ${n.tags.join(' ')}`.toLowerCase();
    return inFolder && text.includes(query.toLowerCase());
  }), [notes, folder, query]);

  function updateActive(patch) {
    setSaved(false);
    setNotes(prev => prev.map(n => n.id === active.id ? { ...n, ...patch, updated: 'Just now' } : n));
  }

  function createNote() {
    const note = { id: crypto.randomUUID(), title: 'Untitled note', body: '', tags: [], folder: folder === 'All notes' ? 'Study' : folder, pinned: false, updated: 'Just now' };
    setNotes(prev => [note, ...prev]); setActiveId(note.id); setFolder(note.folder);
  }

  function removeNote() {
    if (!active) return;
    const next = notes.filter(n => n.id !== active.id);
    setNotes(next); setActiveId(next[0]?.id || null);
  }

  function runAI(command) {
    const text = active?.body || '';
    if (!text.trim()) { setAiMessage('Add some note content first, then I can work with it.'); return; }
    const first = text.split('\n').filter(Boolean).slice(0, 3).join(' ');
    if (command.includes('summar')) setAiMessage(`Summary: ${first}${text.length > 220 ? '…' : ''}`);
    else if (command.includes('action')) setAiMessage('Action candidates: define the outcome, identify stakeholders, gather evidence, choose an intervention, and set a measurable review date.');
    else if (command.includes('quiz')) setAiMessage('Quiz prompt: What are the three strongest causal links in this note, and what evidence would you use to validate each one?');
    else if (command.includes('connect')) setAiMessage('Potential links: look for related concepts, people, places, policies and recurring themes. Your notes already support [[backlinks]] and tags for this.');
    else setAiMessage(`AI workspace: I would process your request against “${active.title}” while preserving the original note.`);
  }

  function submitAI(e) {
    e.preventDefault();
    if (!aiInput.trim()) return;
    runAI(aiInput.toLowerCase()); setAiInput('');
  }

  return (
    <main className="notes-app">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark">N</div><div><strong>Notes</strong><span>AI knowledge workspace</span></div></div>
        <button className="new-note" onClick={createNote}><Icon name="plus"/> New note <kbd>⌘ N</kbd></button>
        <label className="search"><Icon name="search"/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search everything…"/><kbd>⌘ K</kbd></label>
        <nav className="nav">{folders.map(f => <button key={f} className={folder === f ? 'active' : ''} onClick={() => setFolder(f)}><span>{f === 'All notes' ? '◫' : f === 'Study' ? '◇' : f === 'Ideas' ? '✦' : f === 'Projects' ? '□' : '⌁'}</span>{f}<em>{f === 'All notes' ? notes.length : notes.filter(n => n.folder === f).length}</em></button>)}</nav>
        <div className="sidebar-section"><span className="section-label">Smart views</span><button onClick={() => setQuery('')}><span>⌁</span> Recent</button><button onClick={() => setQuery('AI')}><span>◎</span> AI-ready notes</button><button onClick={() => setQuery('[[')}><span>↗</span> Linked notes</button></div>
        <div className="sidebar-footer"><div className="sync-dot"/> Local-first · auto saved</div>
      </aside>

      <section className="note-list">
        <header className="list-header"><div><span className="eyebrow">Workspace</span><h1>{folder}</h1></div><button className="icon-btn"><Icon name="menu"/></button></header>
        <div className="list-meta">{filtered.length} notes <span>·</span> Sorted by recent</div>
        <div className="notes-scroll">{filtered.map(note => <button key={note.id} onClick={() => setActiveId(note.id)} className={`note-card ${activeId === note.id ? 'selected' : ''}`}><div className="card-top"><span className="card-title">{note.title || 'Untitled note'}</span>{note.pinned && <Icon name="pin"/>}</div><p>{note.body.replaceAll('\n', ' ').slice(0, 116) || 'Empty note — start writing…'}</p><div className="card-bottom"><span>{note.updated}</span><span>{note.tags.slice(0, 2).join(' · ')}</span></div></button>)}</div>
      </section>

      <section className="editor-wrap">
        {active ? <>
          <header className="editor-toolbar"><div className="breadcrumbs">{active.folder} <Icon name="chevron"/> {active.title || 'Untitled'}</div><div className="toolbar-actions"><span className="save-state">{saved ? 'Saved' : 'Saving…'}</span><button className={aiOpen ? 'ai-toggle active' : 'ai-toggle'} onClick={() => setAiOpen(v => !v)}><Icon name="spark"/> AI</button><button className="icon-btn" onClick={() => updateActive({ pinned: !active.pinned })}><Icon name="pin"/></button><button className="icon-btn" onClick={removeNote}><Icon name="trash"/></button></div></header>
          <article className="editor">
            <input className="title-input" value={active.title} onChange={e => updateActive({ title: e.target.value })} placeholder="Note title" />
            <div className="properties"><span className="property-pill">{active.folder}</span>{active.tags.map(t => <span className="tag" key={t}>#{t}</span>)}<button onClick={() => updateActive({ tags: [...active.tags, 'New'] })}>+ tag</button></div>
            <div className="format-bar"><button><b>B</b></button><button><i>I</i></button><button>H2</button><button>• List</button><span/><button onClick={() => updateActive({ body: `${active.body}\n\n## Key insight\n` })}>Heading</button><button onClick={() => runAI('summarize')}>⌘ AI</button></div>
            <textarea className="body-input" value={active.body} onChange={e => updateActive({ body: e.target.value })} placeholder="Start thinking…\n\nTip: use [[Note title]] for links and #tags for retrieval. Keep one idea per block so AI can reason over your knowledge cleanly." />
            <div className="editor-footer"><span>Markdown-friendly · {active.body.length} characters</span><span>⌘ Enter · AI command</span></div>
          </article>
        </> : <div className="empty">Create a note to begin.</div>}
      </section>

      {aiOpen && active && <aside className="ai-panel"><div className="ai-head"><div><span className="ai-kicker"><Icon name="spark"/> AI workspace</span><h2>Think with your notes</h2></div><button onClick={() => setAiOpen(false)}>×</button></div><div className="context"><span>Context</span><strong>{active.title}</strong><small>{active.body.length} chars · {active.tags.length} tags</small></div><div className="ai-actions"><button onClick={() => runAI('summarize')}><span>✦</span> Summarize</button><button onClick={() => runAI('extract actions')}><span>→</span> Extract actions</button><button onClick={() => runAI('create quiz')}><span>?</span> Make quiz</button><button onClick={() => runAI('find connections')}><span>↗</span> Find connections</button></div><div className="ai-response"><span className="response-label">ASSISTANT</span><p>{aiMessage}</p></div><form className="ai-input" onSubmit={submitAI}><textarea value={aiInput} onChange={e => setAiInput(e.target.value)} placeholder="Ask anything about this note…" rows={3}/><div><span>AI uses selected note context</span><button type="submit"><Icon name="spark"/> Run</button></div></form><div className="ai-tip">Designed for structured knowledge: summaries, questions, links, decisions and next actions can all become first-class note objects.</div></aside>}
    </main>
  );
}
