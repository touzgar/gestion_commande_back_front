import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/user.entity';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tous les utilisateurs (Admin)' })
  async findAll() {
    return this.userRepository.find({
      select: ['id', 'nom', 'email', 'role', 'estActif', 'telephone', 'adresse', 'profession', 'entreprise', 'poste', 'secteur', 'experience', 'dateInscription'],
      order: { id: 'ASC' },
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtenir un utilisateur (Admin)' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'nom', 'email', 'role', 'estActif', 'telephone', 'adresse', 'profession', 'entreprise', 'poste', 'secteur', 'experience', 'dateInscription'],
    });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un utilisateur (Admin)' })
  async create(@Body() userData: Partial<User>) {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier un utilisateur (Admin)' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateData: Partial<User>) {
    await this.userRepository.update(id, updateData);
    return this.findOne(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un utilisateur (Admin)' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.userRepository.delete(id);
    return { message: 'User deleted' };
  }
}