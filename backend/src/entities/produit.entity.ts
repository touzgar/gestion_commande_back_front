import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Categorie } from './categorie.entity';
import { LigneCommande } from './ligne-commande.entity';

@Entity()
export class Produit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @Column('decimal', { precision: 10, scale: 2 })
  prix: number;

  @Column('int')
  stock: number;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  image: string;

  @ManyToOne(() => Categorie, (categorie) => categorie.produits)
  categorie: Categorie;

  @OneToMany(() => LigneCommande, (ligne) => ligne.produit)
  lignes: LigneCommande[];
}
