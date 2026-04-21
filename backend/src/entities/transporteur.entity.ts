import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Transporteur {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @Column()
  telephone: string;

  @Column({ nullable: true, type: 'text' })
  note: string;
}
