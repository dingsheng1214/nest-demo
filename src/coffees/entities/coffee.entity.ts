import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// 每个Entity类代表一个SQL表
@Entity() // sql table === 'coffee'
export class Coffee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  brand: string;

  @Column('simple-array', { nullable: true })
  flavors: string[];
}
