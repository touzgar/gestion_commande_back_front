import { IsInt, IsOptional, Min, IsString, IsArray, ArrayMinSize, IsEnum } from 'class-validator';
import { CommandeStatut } from '../entities/commande.entity';

export class CreateLigneCommandeDto {
  @IsInt()
  @Min(1)
  produitId: number;

  @IsInt()
  @Min(1)
  quantite: number;
}

export class CreateCommandeDto {
  @IsInt()
  @Min(1)
  userId: number;

  @IsArray()
  @ArrayMinSize(1)
  lignes: CreateLigneCommandeDto[];

  @IsString()
  modePaiement: string;

  @IsString()
  methodeLivraison: string;

  @IsString()
  @IsOptional()
  adresseLivraison?: string;

  @IsString()
  @IsOptional()
  telephoneLivraison?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateCommandeDto {
  @IsOptional()
  @IsEnum(CommandeStatut)
  statut?: CommandeStatut;
}

export class LigneCommandeResponseDto {
  id: number;
  quantite: number;
  prix_unitaire: number;
  produit: any;
}

export class CommandeResponseDto {
  id: number;
  date: Date;
  statut: string;
  montant_total: number;
  lignes: LigneCommandeResponseDto[];
}