import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { LigneCommande } from './ligne-commande.entity';
import { Livraison } from './livraison.entity';
import { Paiement } from './paiement.entity';

export enum CommandeStatut {
  EN_ATTENTE = 'En attente',
  VALIDEE = 'Validée',
  LIVREE = 'Livrée',
  ANNULEE = 'Annulée',
}

@Entity()
export class Commande {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.commandes)
  user: User;

  @Column()
  date: Date;

  @Column({ type: 'enum', enum: CommandeStatut, default: CommandeStatut.EN_ATTENTE })
  statut: CommandeStatut;

  @Column('decimal', { precision: 10, scale: 2 })
  montant_total: number;

  @Column({ nullable: true })
  mode_paiement: string;

  @Column({ nullable: true })
  methode_livraison: string;

  @Column({ nullable: true, type: 'text' })
  adresse_livraison: string;

  @Column({ nullable: true })
  telephone_livraison: string;

  @Column({ nullable: true, type: 'text' })
  notes: string;

  @OneToMany(() => LigneCommande, (ligne) => ligne.commande)
  lignes: LigneCommande[];

  @OneToOne(() => Livraison, (livraison) => livraison.commande)
  livraison: Livraison;

  @OneToMany(() => Paiement, (paiement) => paiement.commande)
  paiements: Paiement[];
}
