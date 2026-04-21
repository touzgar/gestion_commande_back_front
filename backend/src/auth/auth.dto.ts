import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class RegisterDto {
  @IsString()
  @MinLength(2)
  nom: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  motDePasse: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsString()
  @IsOptional()
  telephone?: string;

  @IsString()
  @IsOptional()
  adresse?: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  motDePasse: string;
}

export class AuthResponseDto {
  id: number;
  nom: string;
  email: string;
  role: UserRole;
  telephone?: string;
  adresse?: string;
  token: string;
}