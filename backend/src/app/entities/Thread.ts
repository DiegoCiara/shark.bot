import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Message from './Message';
import Contact from './Contact';
import User from './User';

@Entity({ name: 'threads' })
class Thread extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToMany(() => Message, (message) => message.thread)
  messages!: Message[];

  @ManyToOne(() => Contact, (token) => token.threads)
  @JoinColumn([{ name: 'contact', referencedColumnName: 'id' }])
  contact!: Contact;

  @ManyToOne(() => User, (token) => token.threads, { nullable: true })
  @JoinColumn([{ name: 'user', referencedColumnName: 'id' }])
  user!: User;

  @Column({ type: 'enum', enum: ['USER', 'ASSISTANT'], default: 'ASSISTANT' })
  responsible!: string;

  @Column({ type: 'enum', enum: ['OPEN', 'CLOSED'], default: 'OPEN' })
  status!: string;

  @Column({ nullable: true })
  thread_id!: string; //threadId da openai

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at!: Date;
}

export default Thread;
