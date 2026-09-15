import { Module } from '@nestjs/common';
import { TenantModule } from '../tenant/tenant.module';
import { TenantSettingsController } from './tenant-settings.controller';
import { TenantSettingsRepository } from './tenant-settings.repository';
import { TenantSettingsService } from './tenant-settings.service';

@Module({
    imports: [TenantModule],
    controllers: [TenantSettingsController],
    providers: [
        TenantSettingsService,
        TenantSettingsRepository,
    ],
})
export class TenantSettingsModule { }