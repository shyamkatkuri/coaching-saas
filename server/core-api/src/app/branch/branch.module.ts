import { Module } from '@nestjs/common';
import { TenantModule } from '../tenant/tenant.module';
import { BranchController } from './branch.controller';
import { BranchRepository } from './branch.repository';
import { BranchService } from './branch.service';

@Module({
    imports: [TenantModule],
    controllers: [BranchController],
    providers: [
        BranchService,
        BranchRepository,
    ],
})
export class BranchModule { }