// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
  ) {}

  findByEmail(email: string) {
    return this.usersRepo.findOne({ where: { email } });
  }

  findById(id: number) {
    return this.usersRepo.findOne({ where: { id } });
  }

  create(email: string, passwordHash: string) {
    const user = this.usersRepo.create({ email, passwordHash });
    return this.usersRepo.save(user);
  }
}
