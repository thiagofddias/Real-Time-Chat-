import { Injectable } from '@nestjs/common';

export type ChatUser = {
  id: string;
  name: string;
  room: string;
};

export type ChatMessage = {
  id: string;
  user: string;
  text: string;
  at: number;
  system?: boolean;
  room: string;
};

@Injectable()
export class ChatService {
  private users = new Map<string, ChatUser>();

  registerUser(socketId: string, name: string, room: string): ChatUser {
    const user: ChatUser = { id: socketId, name, room };
    this.users.set(socketId, user);
    return user;
  }

  getUser(socketId: string): ChatUser | undefined {
    return this.users.get(socketId);
  }

  removeUser(socketId: string): ChatUser | undefined {
    const user = this.users.get(socketId);
    if (user) this.users.delete(socketId);
    return user;
  }

  buildMessage(user: string, text: string, room: string, system = false): ChatMessage {
    return {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      user,
      text,
      at: Date.now(),
      system,
      room,
    };
  }
}
