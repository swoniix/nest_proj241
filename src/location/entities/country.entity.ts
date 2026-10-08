import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { City } from './city.entity.js';

@Entity()
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  api_id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, length: 2 })
  code: string;

  @OneToMany(() => City, (city) => city.country)
  cities: City[];
}
