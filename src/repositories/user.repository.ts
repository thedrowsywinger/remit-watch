import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { BaseRepository } from './base.repository';

export class UserRepository extends BaseRepository<User> {
  constructor(repository: Repository<User>) {
    super(repository);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({
      where: { email }
    });
  }

  async findProUsers(): Promise<User[]> {
    return this.repository.find({
      where: { isPro: true }
    });
  }

  async findUsersCreatedAfter(date: Date): Promise<User[]> {
    return this.repository.find({
      where: {
        createdAt: { $gte: date } as any
      },
      order: { createdAt: 'DESC' }
    });
  }

  async updateProStatus(userId: number, isPro: boolean): Promise<User | null> {
    return this.update(userId, { isPro });
  }
} 