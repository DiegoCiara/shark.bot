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
import Workspace from './Workspace';
import Deal from './Deal';
import Document from './Document';
import Profile from './Profile';

@Entity({ name: 'contacts' })
class Contact extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Workspace, (token) => token.Contacts)
  @JoinColumn([{ name: 'workspace', referencedColumnName: 'id' }])
  workspace!: Workspace;

  @ManyToOne(() => Profile, (token) => token.Contacts)
  @JoinColumn([{ name: 'profile', referencedColumnName: 'id' }])
  profile!: Profile;

  @Column()
  name!: string;

  @Column()
  cpf_cnpj!: string;

  @Column()
  phone!: string;

  @Column({ nullable: true })
  email!: string;

  @Column({ type: 'jsonb', nullable: true })
  auth!: any;

  @Column({ type: 'jsonb', nullable: true })
  activity!: Array<{
    name: string;
    description: string;
    createdBy: any;
    created_at: Date;
    json: string;
  }>;

  @OneToMany(() => Deal, (token) => token.contact)
  deals!: Deal[];

  @OneToMany(() => Document, (token) => token.Contact)
  documents!: Document[];

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at!: Date;
}

export default Contact;
