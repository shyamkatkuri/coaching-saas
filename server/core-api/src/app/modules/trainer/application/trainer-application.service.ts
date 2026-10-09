import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  TRAINER_REPOSITORY,
} from '../domain/repositories/trainer.repository';

import type {
  CreateTrainerData,
  TrainerRepository,
  UpdateTrainerData,
} from '../domain/repositories/trainer.repository';

@Injectable()
export class TrainerApplicationService {

  constructor(
    @Inject(
      TRAINER_REPOSITORY,
    )
    private readonly trainers:
      TrainerRepository,
  ) {}

  findAll(
    organizationId: string,
    branchId: string,
  ) {

    return this.trainers.findAll(
      organizationId,
      branchId,
    );
  }

  async findById(
    organizationId: string,
    branchId: string,
    trainerId: string,
  ) {

    const trainer =
      await this.trainers.findById(
        organizationId,
        branchId,
        trainerId,
      );

    if (!trainer) {
      throw new NotFoundException(
        'Trainer not found',
      );
    }

    return trainer;
  }

  create(
    organizationId: string,
    branchId: string,
    data:
      Omit<
        CreateTrainerData,
        | 'organizationId'
        | 'branchId'
      >,
  ) {

    return this.trainers.create({
      organizationId,
      branchId,
      ...data,
    });
  }

  async update(
    organizationId: string,
    branchId: string,
    trainerId: string,
    data: UpdateTrainerData,
  ) {

    const trainer =
      await this.trainers.update(
        organizationId,
        branchId,
        trainerId,
        data,
      );

    if (!trainer) {
      throw new NotFoundException(
        'Trainer not found',
      );
    }

    return trainer;
  }
}