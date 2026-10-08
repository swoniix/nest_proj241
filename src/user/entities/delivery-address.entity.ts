import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Country } from '../../location/entities/country.entity.js';
import { City } from '../../location/entities/city.entity.js';
import { User } from './user.entity.js';

@Entity()
export class DeliveryAddress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  address: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  postal_code: string | null;

  @OneToOne(() => User, (user) => user.delivery_address, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  @ManyToOne(() => Country)
  @JoinColumn({ name: 'country_id' })
  country: Relation<Country>;

  @ManyToOne(() => City)
  @JoinColumn({ name: 'city_id' })
  city: Relation<City>;
}
