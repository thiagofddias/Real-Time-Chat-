import React, { useEffect, useRef, useState } from 'react';
import { useChat } from './ChatContext';

export const Login: React.FC = () => {
  const { setName, setRoom, connected, room } = useChat();
  const [value, setValue] = useState('');
  const [roomValue, setRoomValue] = useState(room ?? 'general');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = value.trim();
    const r = roomValue.trim();
    if (v && r) {
      setRoom(r);
      setName(v);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-[20vh] p-6 border border-gray-700 rounded-xl bg-black">
      <h2 className="mb-3 text-xl font-semibold text-gray-100">Join the Chat</h2>
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-200">
            What's your name?
          </label>
          <input
            ref={inputRef}
            id="name"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="E.g.: John"
            className="w-full px-3 py-2.5 border border-gray-600 rounded-lg bg-gray-900 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="room" className="block mb-2 text-sm font-medium text-gray-200">
            Room
          </label>
          <input
            id="room"
            value={roomValue}
            onChange={(e) => setRoomValue(e.target.value)}
            placeholder="E.g.: general"
            className="w-full px-3 py-2.5 border border-gray-600 rounded-lg bg-gray-900 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button type="submit" disabled={!connected || !value.trim() || !roomValue.trim()} className="px-4 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
          {connected ? 'Enter' : 'Connecting...'}
        </button>
      </form>
    </div>
  );
};
