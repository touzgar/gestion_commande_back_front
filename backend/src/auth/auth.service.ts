import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../entities/user.entity';
import { RegisterDto, LoginDto, AuthResponseDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email déjà utilisé');
    }

    const hashedPassword = await bcrypt.hash(registerDto.motDePasse, 10);
    
    const user = this.userRepository.create({
      ...registerDto,
      motDePasse: hashedPassword,
      role: registerDto.role || UserRole.CLIENT,
    });

    await this.userRepository.save(user);

    const token = this.generateToken(user);

    return {
      id: user.id,
      nom: user.nom,
      email: user.email,
      role: user.role,
      telephone: user.telephone,
      adresse: user.adresse,
      token,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.motDePasse, user.motDePasse);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    if (!user.estActif) {
      throw new UnauthorizedException('Compte désactivé');
    }

    const token = this.generateToken(user);

    return {
      id: user.id,
      nom: user.nom,
      email: user.email,
      role: user.role,
      telephone: user.telephone,
      adresse: user.adresse,
      token,
    };
  }

  async validateUser(userId: number): Promise<User> {
    return this.userRepository.findOne({ where: { id: userId } });
  }

  private generateToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      nom: user.nom,
    };
    return this.jwtService.sign(payload);
  }
}