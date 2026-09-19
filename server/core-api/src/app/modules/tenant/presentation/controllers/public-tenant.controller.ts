import {
    Controller,
    Get,
    NotFoundException,
    Param,
} from '@nestjs/common';

import {
    Public,
} from '../../../../core/security/authentication/public.decorator';

import {
    TenantApplicationService,
} from '../../application/tenant-application.service';

@Public()
@Controller('public/institutes')
export class PublicTenantController {
    constructor(
        private readonly service:
            TenantApplicationService,
    ) { }

    @Get(':slug')
    async findBySlug(
        @Param('slug')
        slug: string,
    ) {
        const tenant =
            await this.service.findBySlug(
                slug,
            );

        if (!tenant) {
            throw new NotFoundException(
                'Institute not found',
            );
        }

        /*
         * Public projection.
         *
         * Don't expose the complete
         * internal tenant model.
         */
        return {
            name:
                tenant.name,

            slug:
                tenant.slug,

            country:
                tenant.country,

            timezone:
                tenant.timezone,
        };
    }
}