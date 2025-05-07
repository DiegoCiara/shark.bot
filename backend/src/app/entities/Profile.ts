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
import Workspace from './Workspace';
import Contact from './Contact';
import Product from './Product';

@Entity({ name: 'profiles' })
class Profile extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Workspace, (user) => user.profiles)
  @JoinColumn([{ name: 'workspace', referencedColumnName: 'id' }])
  workspace!: Workspace;

  @Column()
  name!: string; //Texto retornado pela ia

  @Column({ nullable: true })
  description!: string; //Texto retornado pela ia

  @OneToMany(() => Contact, (deal) => deal.profile)
  Contacts!: Contact[];

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at!: Date; // Modificação feita aqui para permitir valores nulos
}

export default Profile;
