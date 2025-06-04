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

@Entity({ name: 'sessions' })
class Session extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: true })
  assistant_id!: string;

  @Column({ nullable: true })
  token!: string;

  @Column({ type: 'int', default: 20 })
  waiting_time!: number;

  @Column({ nullable: true })
  stop_trigger!: string;

  @Column({ nullable: true })
  close_trigger!: string;

  @Column({ nullable: true })
  human_support_phone!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at!: Date;
}

export default Session;
