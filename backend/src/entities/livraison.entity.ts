import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Commande } from './commande.entity';
import { Transporteur } from './transporteur.entity';

@Entity()
export class Livraison {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Commande, (commande) => commande.livraison)
  @JoinColumn()
  commande: Commande;

  @ManyToOne(() => Transporteur)
  transporteur: Transporteur;

  @Column()
  date_livraison: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  cout: number;

  @Column()
  statut: string; // En préparation, Expédiée, Livrée
}
