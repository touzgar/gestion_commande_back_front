import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll() {
    return this.userRepository.find({
      select: ['id', 'nom', 'email', 'role', 'estActif', 'telephone', 'adresse', 'profession', 'entreprise', 'poste', 'secteur', 'experience', 'dateInscription'],
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'nom', 'email', 'role', 'estActif', 'telephone', 'adresse', 'profession', 'entreprise', 'poste', 'secteur', 'experience', 'dateInscription'],
    });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async create(userData: Partial<User>) {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async update(id: number, updateData: Partial<User>) {
    await this.userRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.userRepository.delete(id);
    return { message: 'User deleted' };
  }
}