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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CategorieService } from './categorie.service';
import { CreateCategorieDto, UpdateCategorieDto } from './categorie.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/user.entity';

@ApiTags('categories')
@Controller('categories')
export class CategorieController {
  constructor(private categorieService: CategorieService) {}

  @Get()
  @ApiOperation({ summary: 'Liste des catégories' })
  findAll() {
    return this.categorieService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir une catégorie' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categorieService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer une catégorie (Admin)' })
  create(@Body() createDto: CreateCategorieDto) {
    return this.categorieService.create(createDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier une catégorie (Admin)' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateCategorieDto,
  ) {
    return this.categorieService.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer une catégorie (Admin)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categorieService.remove(id);
  }
}