import { IsString, IsOptional, IsNumber } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateCategorieDto {
  @IsString()
  nom: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  image?: string;
}

export class UpdateCategorieDto extends PartialType(CreateCategorieDto) {}

export class CategorieResponseDto {
  id: number;
  nom: string;
  description?: string;
  image?: string;
}