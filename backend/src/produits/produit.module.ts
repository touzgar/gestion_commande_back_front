import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProduitController } from './produit.controller';
import { ProduitService } from './produit.service';
import { Produit } from '../entities/produit.entity';
import { Categorie } from '../entities/categorie.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Produit, Categorie])],
  controllers: [ProduitController],
  providers: [ProduitService],
  exports: [ProduitService],
})
export class ProduitModule {}