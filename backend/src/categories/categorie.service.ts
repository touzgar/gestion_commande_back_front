import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categorie } from '../entities/categorie.entity';
import { CreateCategorieDto, UpdateCategorieDto } from './categorie.dto';

@Injectable()
export class CategorieService {
  constructor(
    @InjectRepository(Categorie)
    private categorieRepository: Repository<Categorie>,
  ) {}

  async create(createDto: CreateCategorieDto): Promise<Categorie> {
    const categorie = this.categorieRepository.create(createDto);
    return this.categorieRepository.save(categorie);
  }

  async findAll(): Promise<Categorie[]> {
    return this.categorieRepository.find({ relations: ['produits'] });
  }

  async findOne(id: number): Promise<Categorie> {
    const categorie = await this.categorieRepository.findOne({
      where: { id },
      relations: ['produits'],
    });
    if (!categorie) {
      throw new NotFoundException(`Catégorie avec l'ID ${id} non trouvée`);
    }
    return categorie;
  }

  async update(id: number, updateDto: UpdateCategorieDto): Promise<Categorie> {
    const categorie = await this.findOne(id);
    Object.assign(categorie, updateDto);
    return this.categorieRepository.save(categorie);
  }

  async remove(id: number): Promise<void> {
    const categorie = await this.findOne(id);
    await this.categorieRepository.remove(categorie);
  }
}