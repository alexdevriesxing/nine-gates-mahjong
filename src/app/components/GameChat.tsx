import { useMemo, useState } from 'react';

const REACTIONS = ['🀄', '👏', '🔥', '🎉', '🤔', '😮', '🍀', '🙏', '😂', '❤️'];
const BLOCKED = [
  'fuck', 'shit', 'bitch', 'asshole', 'cunt', 'bastard', 'dick', 'pussy',
  'kanker', 'kut', 'tyfus', 'tering', 'puta', 'mierda', 'scheisse', 'arschloch',
  'connard', 'merde', 'putain',
];

function censor(message: string) {
  return BLOCKED.reduce((current, word) => {
    const pattern = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'giu');
    return current.replace(pattern, '•'.repeat(Math.max(3, word.length)));
  }, message).replace(/https?:\/\/\S+/giu, '[link removed]').slice(0, 160);
}

export default function GameChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ id: number; name: string; text: string }>>([
    { id: 1, name: 'Table Host', text: 'Welcome to the Nine Gates table. Keep chat friendly.' },
  ]);
  const nextId = useMemo(() => Math.max(0, ...messages.map((message) => message.id)) + 1, [messages]);

  const submit = (text = input) => {
    const cleaned = censor(text.trim());
    if (!cleaned) return;
    setMessages((current) => [...current.slice(-24), { id: nextId, name: 'You', text: cleaned }]);
    setInput('');
  };

  return (
    <aside className={`game-chat ${open ? 'game-chat--open' : ''}`}>
      <button className="game-chat__toggle" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
        <span>Chat & reactions</span><strong>{open ? '×' : '💬'}</strong>
      </button>
      {open && (
        <div className="game-chat__body">
          <div className="game-chat__messages" aria-live="polite">
            {messages.map((message) => (
              <p key={message.id}><strong>{message.name}</strong><span>{message.text}</span></p>
            ))}
          </div>
          <div className="game-chat__reactions">
            {REACTIONS.map((emoji) => <button key={emoji} onClick={() => submit(emoji)} aria-label={`React ${emoji}`}>{emoji}</button>)}
          </div>
          <form onSubmit={(event) => { event.preventDefault(); submit(); }}>
            <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Friendly table chat…" maxLength={160} />
            <button type="submit">Send</button>
          </form>
          <small>Profanity and links are filtered automatically.</small>
        </div>
      )}
    </aside>
  );
}
