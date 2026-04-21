import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Commande } from './commande.entity';
import { Produit } from './produit.entity';

@Entity()
export class LigneCommande {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Commande, (commande) => commande.lignes)
  commande: Commande;

  @ManyToOne(() => Produit)
  produit: Produit;

  @Column('int')
  quantite: number;

  @Column('decimal', { precision: 10, scale: 2 })
  prix_unitaire: number;
}
