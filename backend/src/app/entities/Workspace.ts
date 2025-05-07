import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Funnel from './Funnel';
import Deal from './Deal';
import Task from './Task';
import Product from './Product';
import Contact from './Contact';
import Document from './Document';
import Partner from './Partner';
import Profile from './Profile';
import User from './User';

@Entity({ name: 'workspaces' })
class Workspace extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  api_key!: string;

  @OneToMany(() => Deal, (deal) => deal.workspace)
  deals!: Deal[];

  @OneToMany(() => Document, (document) => document.workspace)
  documents!: Document[];

  @OneToMany(() => Contact, (Contact) => Contact.workspace)
  Contacts!: Contact[];

  @OneToMany(() => Profile, (Contact) => Contact.workspace)
  profiles!: Profile[];

  @OneToMany(() => Funnel, (funnel) => funnel.workspace)
  funnels!: Funnel[];

  @OneToMany(() => Product, (product) => product.workspace)
  products!: Product[];

  @OneToMany(() => Task, (credit) => credit.workspace)
  tasks!: Task[];

  @OneToMany(() => Partner, (credit) => credit.workspace)
  partners!: Partner[];

  @OneToMany(() => User, (credit) => credit.workspace)
  users!: User[];

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at!: Date; // Modificação feita aqui para permitir valores nulos
}

export default Workspace;
