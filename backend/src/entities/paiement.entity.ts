import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Commande } from './commande.entity';

@Entity()
export class Paiement {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Commande, (commande) => commande.paiements)
  commande: Commande;

  @Column()
  date: Date;

  @Column()
  statut: string; // En attente, Payé, Échoué

  @Column()
  mode: string; // Carte, PayPal, Virement
}
