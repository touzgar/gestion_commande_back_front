import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './entities/user.entity';
import { Categorie } from './entities/categorie.entity';
import { Commande } from './entities/commande.entity';
import { LigneCommande } from './entities/ligne-commande.entity';
import { Livraison } from './entities/livraison.entity';
import { Paiement } from './entities/paiement.entity';
import { Produit } from './entities/produit.entity';
import { Transporteur } from './entities/transporteur.entity';
import { AuthModule } from './auth/auth.module';
import { CategorieModule } from './categories/categorie.module';
import { ProduitModule } from './produits/produit.module';
import { CommandeModule } from './commandes/commande.module';
import { UploadModule } from './uploads/upload.module';
import { UserModule } from './users/user.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrometheusModule.register(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/gestion_commandes',
      ssl: {
        rejectUnauthorized: false,
      },
      entities: [
        User,
        Categorie,
        Commande,
        LigneCommande,
        Livraison,
        Paiement,
        Produit,
        Transporteur,
      ],
      synchronize: true,
      logging: process.env.NODE_ENV === 'development',
      retryAttempts: 5,
      retryDelay: 3000,
    }),
    AuthModule,
    CategorieModule,
    ProduitModule,
    CommandeModule,
    UploadModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
