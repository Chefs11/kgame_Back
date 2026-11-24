import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

/**
 * Gateway base de las partidas en tiempo real.
 * Cada sala (PIN) es una room de Socket.IO. La lógica de preguntas,
 * puntuación y retroalimentación se agrega sobre esta base.
 */
@WebSocketGateway({
  cors: { origin: process.env.FRONTEND_URL ?? 'http://localhost:3001' },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    client.emit('connected', { id: client.id });
  }

  handleDisconnect(client: Socket) {
    client.rooms.forEach((room) => {
      if (room !== client.id) {
        this.server.to(room).emit('player:left', { id: client.id });
      }
    });
  }

  @SubscribeMessage('room:join')
  async joinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { pin: string; nickname: string },
  ) {
    await client.join(payload.pin);
    this.server
      .to(payload.pin)
      .emit('player:joined', { id: client.id, nickname: payload.nickname });
    return { ok: true, pin: payload.pin };
  }

  @SubscribeMessage('ping')
  ping() {
    return { event: 'pong', data: Date.now() };
  }
}
