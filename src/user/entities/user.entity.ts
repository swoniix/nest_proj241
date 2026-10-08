import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Role } from '../../role/entities/role.entity.js';
import { DeliveryAddress } from './delivery-address.entity.js';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 30 })
  email: string;

  @Column({ nullable: false, length: 100 })
  password_hash: string;

  @Column({ nullable: false, length: 50 })
  fullname: string;

  @Column({ default: false })
  is_block: boolean;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'role_id' })
  role: Relation<Role>;

  @OneToOne(() => DeliveryAddress, (address) => address.user)
  delivery_address: Relation<DeliveryAddress>;
}
