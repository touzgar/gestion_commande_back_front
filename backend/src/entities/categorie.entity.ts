import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Produit } from './produit.entity';

@Entity()
export class Categorie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  image: string;

  @OneToMany(() => Produit, (produit) => produit.categorie)
  produits: Produit[];
}