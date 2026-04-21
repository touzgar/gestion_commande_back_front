import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Commande, CommandeStatut } from '../entities/commande.entity';
import { LigneCommande } from '../entities/ligne-commande.entity';
import { Produit } from '../entities/produit.entity';
import { User } from '../entities/user.entity';
import { CreateCommandeDto, UpdateCommandeDto } from './commande.dto';

@Injectable()
export class CommandeService {
  constructor(
    @InjectRepository(Commande)
    private commandeRepository: Repository<Commande>,
    @InjectRepository(LigneCommande)
    private ligneCommandeRepository: Repository<LigneCommande>,
    @InjectRepository(Produit)
    private produitRepository: Repository<Produit>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createDto: CreateCommandeDto): Promise<Commande> {
    const user = await this.userRepository.findOne({
      where: { id: createDto.userId },
    });
    
    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${createDto.userId} non trouvé`);
    }

    if (createDto.adresseLivraison && createDto.adresseLivraison !== user.adresse) {
      user.adresse = createDto.adresseLivraison;
    }
    if (createDto.telephoneLivraison && createDto.telephoneLivraison !== user.telephone) {
      user.telephone = createDto.telephoneLivraison;
    }
    await this.userRepository.save(user);

    let montantTotal = 0;
    const ligneCommandes: LigneCommande[] = [];

    for (const ligneDto of createDto.lignes) {
      const produit = await this.produitRepository.findOne({
        where: { id: ligneDto.produitId },
      });
      
      if (!produit) {
        throw new NotFoundException(`Produit avec l'ID ${ligneDto.produitId} non trouvé`);
      }
      
      if (produit.stock < ligneDto.quantite) {
        throw new NotFoundException(`Stock insuffisant pour le produit ${produit.nom}`);
      }

      produit.stock -= ligneDto.quantite;
      await this.produitRepository.save(produit);

      const ligne = this.ligneCommandeRepository.create({
        produit,
        quantite: ligneDto.quantite,
        prix_unitaire: Number(produit.prix),
      });
      
      ligneCommandes.push(ligne);
      montantTotal += Number(produit.prix) * ligneDto.quantite;
    }

    const commande = this.commandeRepository.create({
      user,
      date: new Date(),
      statut: CommandeStatut.EN_ATTENTE,
      montant_total: montantTotal,
      mode_paiement: createDto.modePaiement,
      methode_livraison: createDto.methodeLivraison,
      adresse_livraison: createDto.adresseLivraison || user.adresse,
      telephone_livraison: createDto.telephoneLivraison || user.telephone,
      notes: createDto.notes,
      lignes: ligneCommandes,
    });

    const savedCommande = await this.commandeRepository.save(commande);

    for (const ligne of ligneCommandes) {
      ligne.commande = savedCommande;
      await this.ligneCommandeRepository.save(ligne);
    }

    return this.findOne(savedCommande.id);
  }

  async findAll(): Promise<Commande[]> {
    return this.commandeRepository.find({
      relations: ['user', 'lignes', 'lignes.produit', 'lignes.produit.categorie'],
      order: { date: 'DESC' },
    });
  }

  async findByUser(userId: number): Promise<Commande[]> {
    return this.commandeRepository.find({
      where: { user: { id: userId } as any },
      relations: ['lignes', 'lignes.produit', 'lignes.produit.categorie'],
      order: { date: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Commande> {
    const commande = await this.commandeRepository.findOne({
      where: { id },
      relations: ['user', 'lignes', 'lignes.produit', 'lignes.produit.categorie'],
    });
    if (!commande) {
      throw new NotFoundException(`Commande avec l'ID ${id} non trouvée`);
    }
    return commande;
  }

  async updateStatut(id: number, statut: CommandeStatut): Promise<Commande> {
    const commande = await this.findOne(id);
    commande.statut = statut;
    return this.commandeRepository.save(commande);
  }

  async getStats(): Promise<any> {
    const total = await this.commandeRepository.count();
    const commandes = await this.commandeRepository.find();
    
    let revenus = 0;
    commandes.forEach(c => {
      revenus += Number(c.montant_total);
    });

    const enAttente = await this.commandeRepository.count({
      where: { statut: CommandeStatut.EN_ATTENTE },
    });
    const Validees = await this.commandeRepository.count({
      where: { statut: CommandeStatut.VALIDEE },
    });
    const Livrees = await this.commandeRepository.count({
      where: { statut: CommandeStatut.LIVREE },
    });

    return {
      total,
      revenus,
      enAttente,
      Validees,
      Livrees,
    };
  }
}