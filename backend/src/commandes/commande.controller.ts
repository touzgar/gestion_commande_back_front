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
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CommandeService } from './commande.service';
import { CreateCommandeDto, UpdateCommandeDto } from './commande.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/user.entity';

@ApiTags('commandes')
@Controller('commandes')
export class CommandeController {
  constructor(private commandeService: CommandeService) {}

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Statistiques des commandes (Admin)' })
  getStats() {
    return this.commandeService.getStats();
  }

  @Get('user/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mes commandes' })
  getMyOrders(@Request() req) {
    return this.commandeService.findByUser(req.user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toutes les commandes (Admin)' })
  findAll() {
    return this.commandeService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtenir une commande' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.commandeService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer une commande' })
  create(@Body() createDto: CreateCommandeDto) {
    return this.commandeService.create(createDto);
  }

  @Put(':id/statut')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier le statut (Admin)' })
  updateStatut(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateCommandeDto,
  ) {
    return this.commandeService.updateStatut(id, updateDto.statut);
  }
}