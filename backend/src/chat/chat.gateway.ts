import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ValidationPipe } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { JoinDto } from './dto/join.dto';
import { SendMessageDto } from './dto/send-message.dto';
import type { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData } from './types';

@WebSocketGateway({
  cors: {
    origin: [process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173'],
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

  constructor(private readonly chat: ChatService) {}

  handleConnection(client: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>) {
  }

  handleDisconnect(client: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>) {
    const user = this.chat.removeUser(client.id);
    if (user) {
      const status = this.chat.buildMessage('system', `${user.name} left the room`, user.room, true);
      this.server.to(user.room).emit('chat:status', status);
    }
  }

  @SubscribeMessage('chat:join')
  handleJoin(
    @ConnectedSocket() client: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
    @MessageBody(new ValidationPipe({ transform: true })) body: JoinDto,
  ) {
    const previous = this.chat.getUser(client.id);
    const user = this.chat.registerUser(client.id, body.name.trim(), body.room.trim());
    if (previous && previous.room !== user.room) {
      client.leave(previous.room);
      const left = this.chat.buildMessage('system', `${previous.name} left the room`, previous.room, true);
      this.server.to(previous.room).emit('chat:status', left);
    }
    client.join(user.room);
    const status = this.chat.buildMessage('system', `${user.name} joined the room`, user.room, true);
    client.emit('chat:joined', { ok: true, name: user.name, room: user.room });
    this.server.to(user.room).emit('chat:status', status);
  }

  @SubscribeMessage('chat:message')
  handleMessage(
    @ConnectedSocket() client: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>,
    @MessageBody(new ValidationPipe({ transform: true })) body: SendMessageDto,
  ) {
    const user = this.chat.getUser(client.id);
    if (!user) {
      client.emit('chat:error', { message: 'You need to join before sending messages.' });
      return;
    }
    const room = body.room.trim();
    if (user.room !== room) {
      client.emit('chat:error', { message: 'You are not in this room.' });
      return;
    }
    const msg = this.chat.buildMessage(user.name, body.text.trim(), user.room);
    this.server.to(user.room).emit('chat:message', msg);
  }
}
