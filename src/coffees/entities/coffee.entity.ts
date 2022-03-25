import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Flavor } from './flavor.entity';

// 每个Entity类代表一个SQL表
@Entity() // sql table === 'coffee'
// @Index(['name', 'brand'], { unique: true }) // 联合索引
export class Coffee {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('name') // 单列索引
  // @Index({ unique: true }) // 唯一索引
  @Column()
  name: string;

  @Column()
  brand: string;

  @Column({ default: 0 })
  recommendations: number;

  @ManyToMany(() => Flavor, (flavor) => flavor.coffees)
  @JoinTable()
  flavors: Flavor[];
}
