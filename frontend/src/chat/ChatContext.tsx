import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import type { ChatMessage } from './types';

type ChatContextValue = {
  name: string | null;
  setName: (n: string | null) => void;
  room: string | null;
  setRoom: (r: string | null) => void;
  messages: ChatMessage[];
  sendMessage: (text: string) => void;
  connected: boolean;
  errors: string[];
  clearErrors: () => void;
};

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

const STORAGE_NAME_KEY = 'chat:name';
const STORAGE_ROOM_KEY = 'chat:room';

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [name, setNameState] = useState<string | null>(() => localStorage.getItem(STORAGE_NAME_KEY));
  const [room, setRoomState] = useState<string | null>(() => localStorage.getItem(STORAGE_ROOM_KEY) ?? 'general');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connected, setConnected] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const url = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:3000';
    const socket = io(url, { transports: ['websocket'] });
    socketRef.current = socket;

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    socket.on('chat:status', (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    });
    socket.on('chat:message', (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    });
    socket.on('chat:error', (e: { message: string }) => {
      setErrors((prev) => [...prev, e.message]);
    });

    socket.on('chat:joined', () => {
      setMessages([]);
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (name && room && socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('chat:join', { name, room });
    }
  }, [name, room, connected]);

  const setName = useCallback((n: string | null) => {
    setNameState(n);
    if (n) localStorage.setItem(STORAGE_NAME_KEY, n);
    else localStorage.removeItem(STORAGE_NAME_KEY);
  }, []);

  const setRoom = useCallback((r: string | null) => {
    setRoomState(r);
    if (r) localStorage.setItem(STORAGE_ROOM_KEY, r);
    else localStorage.removeItem(STORAGE_ROOM_KEY);
  }, []);

  const sendMessage = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed || !socketRef.current || !room) return;
    socketRef.current.emit('chat:message', { text: trimmed, room });
  }, [room]);

  const clearErrors = useCallback(() => setErrors([]), []);

  const value = useMemo<ChatContextValue>(
    () => ({ name, setName, room, setRoom, messages, sendMessage, connected, errors, clearErrors }),
    [name, setName, room, setRoom, messages, sendMessage, connected, errors, clearErrors],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
};
