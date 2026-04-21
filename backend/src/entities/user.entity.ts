import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Commande } from './commande.entity';

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  CLIENT = 'client',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @Column({ unique: true })
  email: string;

  @Column()
  motDePasse: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CLIENT })
  role: UserRole;

  @Column({ default: true })
  estActif: boolean;

  @Column({ nullable: true })
  telephone: string;

   @Column({ type: 'text', nullable: true })
   adresse: string;

   @Column({ nullable: true })
   profession: string;

   @Column({ nullable: true })
   entreprise: string;

   @Column({ nullable: true })
   poste: string;

   @Column({ nullable: true })
   secteur: string;

   @Column({ nullable: true })
   experience: number;

   @Column({ type: 'date', nullable: true })
   dateInscription: Date;

   @OneToMany(() => Commande, (commande) => commande.user)
   commandes: Commande[];
}