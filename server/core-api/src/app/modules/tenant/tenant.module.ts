import {
    Module,
} from '@nestjs/common';

import {
    TENANT_REPOSITORY,
} from '../tenant/domain/repositories/tenant.repository';

import {
    PostgresTenantRepository,
} from '../tenant/infrastructure/persistence/postgres/postgres-tenant.repository';

import {
    TenantApplicationService,
} from './application/tenant-application.service';

import {
    TenantController,
} from '../tenant/presentation/controllers/tenant.controller';
import { TenantSettingsController } from './presentation/controllers/tenant-settings.controller';
import { BranchController } from './presentation/controllers/branch.controller';
import { BranchApplicationService } from './application/branch-application.service';
import { TenantSettingsApplicationService } from './application/tenant-settings-application.service';
import { PostgresTenantSettingsRepository } from './infrastructure/persistence/postgres/postgres-tenant-settings.repository';
import { BRANCH_REPOSITORY } from './domain/repositories/branch.repository';
import { TENANT_SETTINGS_REPOSITORY } from './domain/repositories/tenant-settings.repository';
import { PostgresBranchRepository } from './infrastructure/persistence/postgres/postgres-branch.repository';
import { PublicTenantController } from './presentation/controllers/public-tenant.controller';

@Module({
    controllers: [
        TenantController,
        BranchController,
        TenantSettingsController,
        PublicTenantController
    ],

    providers: [
        TenantApplicationService,
        BranchApplicationService,
        TenantSettingsApplicationService,

        PostgresTenantRepository,
        PostgresBranchRepository,
        PostgresTenantSettingsRepository,

        {
            provide: TENANT_REPOSITORY,
            useExisting: PostgresTenantRepository,
        },
        {
            provide: BRANCH_REPOSITORY,
            useExisting: PostgresBranchRepository,
        },
        {
            provide: TENANT_SETTINGS_REPOSITORY,
            useExisting: PostgresTenantSettingsRepository,
        },
    ],

    exports: [
        TENANT_REPOSITORY,
        TenantApplicationService,
    ],
})
export class TenantModule { } 