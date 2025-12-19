import React, { useEffect, useMemo, useRef, useState, Suspense } from 'react';
import { Theme, type EmojiClickData } from 'emoji-picker-react';
const EmojiPicker = React.lazy(() => import('emoji-picker-react'));
import { useChat } from './ChatContext';
import type { ChatMessage } from './types';

export const Chat: React.FC = () => {
  const { messages, sendMessage, name, setName, room, setRoom, errors, clearErrors } = useChat();
  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [] = useState<number>(() => Date.now());

  const sortedMessages = useMemo<ChatMessage[]>(
    () => messages.slice().sort((a, b) => a.at - b.at),
    [messages],
  );
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [sortedMessages]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    sendMessage(t);
    setText('');
  };

  const onSwitch = () => {
    setName(null);
    setRoom(null);
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setText((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const renderHeader = () => (
    <header className="px-4 py-2.5 border-b border-gray-700 bg-gray-800 flex items-center gap-3 flex-wrap">
      <div className="ml-auto text-sm text-gray-200 flex items-center gap-3 flex-wrap">
        <span>
          You: <b>{name}</b>
        </span>
        <span className="text-gray-300">Room: <b>{room}</b></span>
        <button onClick={onSwitch} className="px-2 py-1 text-xs rounded bg-gray-700 hover:bg-gray-600 text-gray-200">
          Switch
        </button>
      </div>
    </header>
  );

  const renderErrors = () => {
    if (errors.length === 0) return null;
    return (
      <div className="bg-red-900 text-red-200 border border-red-700 rounded-lg p-3 mb-3">
        {errors.map((e, i) => (
          <div key={i}>{e}</div>
        ))}
        <button onClick={clearErrors} className="mt-1.5 px-3 py-1 text-sm rounded bg-red-800 hover:bg-red-700 border border-red-600 text-red-100">
          close
        </button>
      </div>
    );
  };

  const renderMessages = () => (
    <>
      {sortedMessages.map((m) => (
        <div key={m.id} className="mb-2.5 text-gray-100">
          {m.system ? (
            <div className="italic text-gray-400">{m.text}</div>
          ) : (
            <div>
              <b className="text-blue-400">{m.user}:</b> {m.text}
            </div>
          )}
        </div>
      ))}
    </>
  );

  const renderForm = () => (
    <form onSubmit={onSubmit} className="flex gap-2 p-3 border-t border-gray-700 bg-gray-800 flex-wrap">
      <div className="flex-1 flex gap-2 min-w-[240px] flex-wrap items-start">
        <div className="relative flex-1 min-w-[220px]">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message"
            className="w-full px-3 py-2.5 rounded-lg border border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          className="px-4 py-2.5 rounded-lg bg-gray-700 hover:bg-gray-600 border border-gray-600 text-gray-200"
          title="Emojis"
        >
          😀
        </button>
        <button
          type="submit"
          disabled={!text.trim()}
          className="px-4 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
      {showEmojiPicker && (
        <div className="absolute bottom-20 right-4 z-10">
          <Suspense fallback={<div className="px-3 py-2 rounded bg-gray-800 text-gray-300 border border-gray-700">Carregando emojis…</div>}>
            <EmojiPicker onEmojiClick={onEmojiClick} theme={Theme.DARK} />
          </Suspense>
        </div>
      )}
    </form>
  );

  return (
    <div className="grid grid-rows-[auto_1fr_auto] h-screen text-gray-100 bg-gray-900 relative">
      {renderHeader()}
      <div ref={listRef} className="overflow-y-auto p-4 bg-gray-900">
        {renderErrors()}
        {renderMessages()}
      </div>
      {renderForm()}
    </div>
  );
}
