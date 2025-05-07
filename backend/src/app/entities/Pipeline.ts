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
import User from './User';
import Workspace from './Workspace';
import Funnel from './Funnel';
import Deal from './Deal';

@Entity({ name: 'pipelines' })
class Pipeline extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Funnel, (token) => token.pipelines)
  @JoinColumn([{ name: 'funnel', referencedColumnName: 'id' }])
  funnel!: Funnel;

  @OneToMany(() => Deal, (token) => token.pipeline)
  deals!: Deal[];

  @Column()
  name!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({ type: 'int' })
  position!: number;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at!: Date;
}

export default Pipeline;
