import {
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
} from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { TenantService } from './tenant.service';

@Controller('tenants')
export class TenantController {
    constructor(
        private readonly tenantService: TenantService,
    ) { }

    @Get()
    findAll() {
        return this.tenantService.findAll();
    }

    @Get(':id')
    findById(
        @Param('id', new ParseUUIDPipe())
        id: string,
    ) {
        return this.tenantService.findById(id);
    }

    @Post()
    create(
        @Body()
        dto: CreateTenantDto,
    ) {
        return this.tenantService.create(dto);
    }

    @Patch(':id')
    update(
        @Param('id', new ParseUUIDPipe())
        id: string,

        @Body()
        dto: UpdateTenantDto,
    ) {
        return this.tenantService.update(
            id,
            dto,
        );
    }
}