import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { TenantRepository } from './tenant.repository';

@Injectable()
export class TenantService {
    constructor(
        private readonly tenantRepository: TenantRepository,
    ) { }

    async findAll() {
        return this.tenantRepository.findAll();
    }

    async findById(id: string) {
        const tenant =
            await this.tenantRepository.findById(id);

        if (!tenant) {
            throw new NotFoundException(
                `Tenant ${id} not found`,
            );
        }

        return tenant;
    }

    async create(dto: CreateTenantDto) {
        const existingSlug =
            await this.tenantRepository.findBySlug(
                dto.slug,
            );

        if (existingSlug) {
            throw new ConflictException(
                'Tenant slug already exists',
            );
        }

        const existingCode =
            await this.tenantRepository.findByCode(
                dto.code,
            );

        if (existingCode) {
            throw new ConflictException(
                'Tenant code already exists',
            );
        }

        return this.tenantRepository.create({
            name: dto.name,
            slug: dto.slug,
            code: dto.code.toUpperCase(),
            status: dto.status ?? 'ACTIVE',
            timezone:
                dto.timezone ?? 'Asia/Kolkata',
            currency: dto.currency ?? 'INR',
            country: dto.country ?? 'India',
        });
    }

    async update(
        id: string,
        dto: UpdateTenantDto,
    ) {
        await this.findById(id);

        if (dto.slug) {
            const existing =
                await this.tenantRepository.findBySlug(
                    dto.slug,
                );

            if (existing && existing.id !== id) {
                throw new ConflictException(
                    'Tenant slug already exists',
                );
            }
        }

        return this.tenantRepository.update(
            id,
            dto,
        );
    }
}