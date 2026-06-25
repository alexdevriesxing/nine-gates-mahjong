import { useEffect, useRef, useState } from 'react';

export interface ChatMessage {
  id: string;
  name: string;
  text: string;
  createdAt: number;
}

const REACTIONS = ['🀄', '👏', '🔥', '🎉', '🤔', '😮', '🍀', '🙏', '😂', '❤️'];

interface GameChatProps {
  messages: ChatMessage[];
  onSend: (text: string) => void;
  title?: string;
  disabled?: boolean;
}

export default function GameChat({
  messages,
  onSend,
  title = 'Room chat & reactions',
  disabled = false,
}: GameChatProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const messagesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open && messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages, open]);

  const submit = (text = input) => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setInput('');
  };

  return (
    <aside className={`game-chat ${open ? 'game-chat--open' : ''}`}>
      <button className="game-chat__toggle" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
        <span>{title}</span><strong aria-hidden="true">{open ? '×' : '💬'}</strong>
      </button>
      {open && (
        <div className="game-chat__body">
          <div className="game-chat__messages" aria-live="polite" ref={messagesRef}>
            {messages.length ? messages.map((message) => (
              <p key={message.id}><strong>{message.name}</strong><span>{message.text}</span></p>
            )) : <p><span>No messages yet. Wish the table good luck.</span></p>}
          </div>
          <div className="game-chat__reactions">
            {REACTIONS.map((emoji) => (
              <button disabled={disabled} key={emoji} onClick={() => submit(emoji)} aria-label={`React ${emoji}`}>{emoji}</button>
            ))}
          </div>
          <form onSubmit={(event) => { event.preventDefault(); submit(); }}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Friendly table chat…"
              maxLength={160}
              disabled={disabled}
              aria-label="Room chat message"
            />
            <button type="submit" disabled={disabled || !input.trim()}>Send</button>
          </form>
          <small>Messages are shared with this room. Profanity and links are filtered.</small>
        </div>
      )}
    </aside>
  );
}
