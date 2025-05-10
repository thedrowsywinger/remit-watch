import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { FxRate } from '../entities/fx-rate.entity';
import { BaseRepository } from './base.repository';

export class FxRateRepository extends BaseRepository<FxRate> {
  constructor(repository: Repository<FxRate>) {
    super(repository);
  }

  async findLatestRate(pair: string): Promise<FxRate | null> {
    return this.repository.findOne({
      where: { pair },
      order: { timestamp: 'DESC' }
    });
  }

  async findRatesByDateRange(
    pair: string,
    startDate: Date,
    endDate: Date
  ): Promise<FxRate[]> {
    return this.repository.find({
      where: {
        pair,
        timestamp: Between(startDate, endDate)
      },
      order: { timestamp: 'ASC' }
    });
  }

  async findRatesByThreshold(
    pair: string,
    threshold: number,
    isGreaterThan: boolean
  ): Promise<FxRate[]> {
    return this.repository.find({
      where: {
        pair,
        rate: isGreaterThan ? MoreThanOrEqual(threshold) : LessThanOrEqual(threshold)
      },
      order: { timestamp: 'DESC' }
    });
  }

  async findRatesBySource(source: string): Promise<FxRate[]> {
    return this.repository.find({
      where: { source },
      order: { timestamp: 'DESC' }
    });
  }
} 