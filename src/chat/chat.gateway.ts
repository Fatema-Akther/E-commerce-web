import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';

interface User {
  username: string;
  socketId: string;
}


@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private users = new Map<string, User>(); // Store users by socket ID

  constructor(private readonly chatService: ChatService) {}

  // Handle user connection
  async handleConnection(socket: Socket) {
    console.log(`User connected: ${socket.id}`);
    const user = this.users.get(socket.id);
    if (user) {
      const messages = await this.chatService.getMessagesForUser(user.username);
      socket.emit('receiveMessage', messages);
      await this.chatService.markMessagesAsRead(user.username);
    }
  }

  // Handle user disconnection
  handleDisconnect(socket: Socket) {
    console.log(`User disconnected: ${socket.id}`);
    this.users.delete(socket.id);
    this.updateUserList();
  }

  // User joins the chat
  @SubscribeMessage('join')
  async handleJoin(
    @MessageBody() username: string,
    @ConnectedSocket() socket: Socket,
  ) {
    this.users.set(socket.id, { username, socketId: socket.id });
    this.updateUserList();

    const messages = await this.chatService.getMessagesForUser(username);
    socket.emit('receiveMessage', messages);
    await this.chatService.markMessagesAsRead(username);
  }

  // Send message
  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() { sender, receiver, message }: { sender: string; receiver: string; message: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const savedMessage = await this.chatService.saveMessage(sender, receiver, message);

    const receiverSocket = Array.from(this.users.values()).find(
      (user) => user.username === receiver,
    );

    if (receiverSocket) {
      this.server.to(receiverSocket.socketId).emit('receiveMessage', savedMessage);
      await this.chatService.markMessagesAsRead(receiver);
    } else {
      console.log(`User ${receiver} is offline. Message saved for later.`);
    }
  }

  // Update user list for all connected users
  private updateUserList() {
    const userList = Array.from(this.users.values()).map(user => user.username);
    this.server.emit('users', userList);
  }
}
