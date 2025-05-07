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
import Deal from './Deal';
import Task from './Task';
import Workspace from './Workspace';

@Entity({ name: 'users' })
class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Workspace, (token) => token.users)
  @JoinColumn([{ name: 'workspace', referencedColumnName: 'id' }])
  workspace!: Workspace;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column({ type: 'enum', enum: ['OWNER', 'ADMIN', 'MEMBER', 'SUPPORT'], default: 'MEMBER' })
  role!: string;

  @Column({ nullable: true, default: false })
  has_reset_pass!: boolean;

  @Column()
  password_hash!: string;

  @Column({ nullable: true })
  picture!: string;

  @Column({ nullable: true })
  token_reset_password!: string;

  @Column({ nullable: true, type: 'timestamp' })
  reset_password_expires!: Date;

  // @Column()
  // secret!: string;

  // @Column()
  // token_auth_secret!: string;

  // @Column({ default: false })
  // has_configured_2fa!: boolean;

  @OneToMany(() => Deal, (workspace) => workspace.user)
  deals!: Deal[];

  @OneToMany(() => Task, (workspace) => workspace.user)
  tasks!: Task[];

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at!: Date; // Modificação feita aqui para permitir valores nulos
}

export default User;
