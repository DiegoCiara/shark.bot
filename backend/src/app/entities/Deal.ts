import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Pipeline from './Pipeline';
import Workspace from './Workspace';
import User from './User';
import Task from './Task';
import Contact from './Contact';
import Product from './Product';
import Partner from './Partner';

@Entity({ name: 'deals' })
class Deal extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Pipeline, (token) => token.deals)
  @JoinColumn([{ name: 'pipeline', referencedColumnName: 'id' }])
  pipeline!: Pipeline;

  @ManyToOne(() => Contact, (token) => token.deals)
  @JoinColumn([{ name: 'contact', referencedColumnName: 'id' }])
  contact!: Contact;

  @ManyToOne(() => Workspace, (token) => token.deals)
  @JoinColumn([{ name: 'workspace', referencedColumnName: 'id' }])
  workspace!: Workspace;

  @ManyToOne(() => User, (token) => token.deals, { nullable: true })
  @JoinColumn([{ name: 'user', referencedColumnName: 'id' }])
  user!: User;

  @ManyToOne(() => Product, (token) => token.deals, { nullable: true })
  @JoinColumn([{ name: 'product', referencedColumnName: 'id' }])
  product!: Product;

  @ManyToOne(() => Partner, (token) => token.deals, { nullable: true })
  @JoinColumn([{ name: 'partner', referencedColumnName: 'id' }])
  partner!: Partner;

  @Column({
    type: 'enum',
    enum: ['INPROGRESS', 'PENDING', 'WON', 'LOST', 'ARCHIVED'],
    default: 'INPROGRESS',
  })
  status!: string;

  @Column({
    type: 'float',
  })
  value!: number;

  @Column({ nullable: true })
  observation!: string;

  @Column({ nullable: true })
  deadline!: Date;

  @Column({ type: 'jsonb', nullable: true })
  activity!: Array<{
    name: string;
    description: string;
    createdBy: any;
    created_at: Date;
    json: string;
  }>;

  @OneToMany(() => Task, (task) => task.deal)
  tasks!: Task[];

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at!: Date;
}

export default Deal;
