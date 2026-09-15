import {
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
} from '@nestjs/common';



import {
    CreateTenantDto,
} from '../dto/create-tenant.dto';
import { TenantApplicationService } from '../../application/tenant-application.service';
import { UpdateTenantDto } from '../dto/update-tenant.dto';



@Controller('tenants')
export class TenantController {
    constructor(
        private readonly service:
            TenantApplicationService,
    ) { }

    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Get(':id')
    findById(
        @Param(
            'id',
            ParseUUIDPipe,
        )
        id: string,
    ) {
        return this.service.findById(id);
    }

    @Post()
    create(
        @Body()
        dto: CreateTenantDto,
    ) {
        return this.service.create(dto);
    }

    @Patch(':id')
    update(
        @Param(
            'id',
            ParseUUIDPipe,
        )
        id: string,

        @Body()
        dto: UpdateTenantDto,
    ) {
        return this.service.update(
            id,
            dto as Parameters<TenantApplicationService['update']>[1],
        );
    }
}