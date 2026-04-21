import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Produit } from '../entities/produit.entity';
import { Categorie } from '../entities/categorie.entity';
import { CreateProduitDto, UpdateProduitDto } from './produit.dto';

@Injectable()
export class ProduitService {
  constructor(
    @InjectRepository(Produit)
    private produitRepository: Repository<Produit>,
    @InjectRepository(Categorie)
    private categorieRepository: Repository<Categorie>,
  ) {}

  async create(createDto: CreateProduitDto): Promise<Produit> {
    const { categorieId, ...produitData } = createDto;
    
    const produit = this.produitRepository.create(produitData);
    
    if (categorieId) {
      const categorie = await this.categorieRepository.findOne({
        where: { id: categorieId },
      });
      if (categorie) {
        produit.categorie = categorie;
      }
    }
    
    return this.produitRepository.save(produit);
  }

  async findAll(): Promise<Produit[]> {
    return this.produitRepository.find({
      relations: ['categorie'],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Produit> {
    const produit = await this.produitRepository.findOne({
      where: { id },
      relations: ['categorie'],
    });
    if (!produit) {
      throw new NotFoundException(`Produit avec l'ID ${id} non trouvé`);
    }
    return produit;
  }

  async update(id: number, updateDto: UpdateProduitDto): Promise<Produit> {
    const produit = await this.findOne(id);
    const { categorieId, ...updateData } = updateDto;
    
    Object.assign(produit, updateData);
    
    if (categorieId) {
      const categorie = await this.categorieRepository.findOne({
        where: { id: categorieId },
      });
      if (categorie) {
        produit.categorie = categorie;
      }
    }
    
    return this.produitRepository.save(produit);
  }

  async remove(id: number): Promise<void> {
    const produit = await this.findOne(id);
    await this.produitRepository.remove(produit);
  }

  async findByCategory(categorieId: number): Promise<Produit[]> {
    return this.produitRepository.find({
      where: { categorie: { id: categorieId } as any },
      relations: ['categorie'],
    });
  }
}