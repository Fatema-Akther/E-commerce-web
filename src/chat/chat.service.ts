import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatMessage } from './chat.entity';

// chat.service.ts
@Injectable()
export class ChatService {
  getMessages() {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(ChatMessage)
    private readonly chatRepository: Repository<ChatMessage>,
  ) {}

  async saveMessage(sender: string, receiver: string, message: string): Promise<ChatMessage> {
    const newMessage = this.chatRepository.create({ sender, receiver, message,  delivered: false });
    return await this.chatRepository.save(newMessage);
  }

  async getMessagesForUser(receiver: string): Promise<ChatMessage[]> {
    return await this.chatRepository.find({
      where: { receiver,  delivered: false },
      order: { createdAt: 'ASC' },
    });
  }

  async markMessagesAsRead(receiver: string): Promise<void> {
    await this.chatRepository.update({ receiver,  delivered: false }, {  delivered: true });
  }
}