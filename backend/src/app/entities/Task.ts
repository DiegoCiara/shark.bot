import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Workspace from './Workspace';
import User from './User';
import Deal from './Deal';

@Entity({ name: 'tasks' })
class Task extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Workspace, (token) => token.tasks)
  @JoinColumn([{ name: 'workspace', referencedColumnName: 'id' }])
  workspace!: Workspace;

  @ManyToOne(() => Deal, (token) => token.tasks, { nullable: true })
  @JoinColumn([{ name: 'contact', referencedColumnName: 'id' }])
  deal!: Deal;

  @ManyToOne(() => User, (token) => token.tasks)
  @JoinColumn([{ name: 'user', referencedColumnName: 'id' }])
  user!: User;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({
    type: 'enum',
    enum: ['PENDING', 'COMPLETED', 'CANCELED', 'ARCHIVED'],
    default: 'PENDING',
  })
  status!: string;

  @Column()
  deadline!: Date;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at!: Date;
}

export default Task;
