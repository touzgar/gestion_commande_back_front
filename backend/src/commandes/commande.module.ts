import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandeController } from './commande.controller';
import { CommandeService } from './commande.service';
import { Commande } from '../entities/commande.entity';
import { LigneCommande } from '../entities/ligne-commande.entity';
import { Produit } from '../entities/produit.entity';
import { User } from '../entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Commande,
      LigneCommande,
      Produit,
      User,
    ]),
  ],
  controllers: [CommandeController],
  providers: [CommandeService],
  exports: [CommandeService],
})
export class CommandeModule {}