import type { ChatMessage } from './chat.service';
import type { JoinDto } from './dto/join.dto';
import type { SendMessageDto } from './dto/send-message.dto';

export interface ClientToServerEvents {
  'chat:join': (payload: JoinDto) => void;
  'chat:message': (payload: SendMessageDto) => void;
}

export interface ServerToClientEvents {
  'chat:status': (payload: ChatMessage) => void;
  'chat:message': (payload: ChatMessage) => void;
  'chat:joined': (payload: { ok: boolean; name: string; room: string }) => void;
  'chat:error': (payload: { message: string }) => void;
}

export interface InterServerEvents {}

export interface SocketData {}
