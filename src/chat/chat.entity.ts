import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ChatMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sender: string;

  @Column()
  receiver: string;

  @Column()
  message: string;

  @Column({ default: false }) // False means not yet delivered
  delivered: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
