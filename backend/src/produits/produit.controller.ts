import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProduitService } from './produit.service';
import { CreateProduitDto, UpdateProduitDto } from './produit.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/user.entity';

@ApiTags('produits')
@Controller('produits')
export class ProduitController {
  constructor(private produitService: ProduitService) {}

  @Get()
  @ApiOperation({ summary: 'Liste des produits' })
  findAll() {
    return this.produitService.findAll();
  }

  @Get('categorie/:categorieId')
  @ApiOperation({ summary: 'Produits par catégorie' })
  findByCategory(@Param('categorieId', ParseIntPipe) categorieId: number) {
    return this.produitService.findByCategory(categorieId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir un produit' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.produitService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un produit (Admin)' })
  create(@Body() createDto: CreateProduitDto) {
    return this.produitService.create(createDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier un produit (Admin)' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateProduitDto,
  ) {
    return this.produitService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer un produit (Admin)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.produitService.remove(id);
  }
}