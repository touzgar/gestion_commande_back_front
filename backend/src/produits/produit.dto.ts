import { IsString, IsOptional, IsNumber, Min, IsInt } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateProduitDto {
  @IsString()
  nom: string;

  @IsNumber()
  @Min(0)
  prix: number;

  @IsInt()
  @Min(0)
  stock: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsNumber()
  @IsOptional()
  categorieId?: number;
}

export class UpdateProduitDto extends PartialType(CreateProduitDto) {}

export class ProduitResponseDto {
  id: number;
  nom: string;
  prix: number;
  stock: number;
  description?: string;
  image?: string;
  categorie?: any;
}