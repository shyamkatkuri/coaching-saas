import {
    Controller,
    Get,
    Req,
} from '@nestjs/common';

import {
    IdentityService,
} from '../application/identity.service';
import type { AuthenticatedRequest } from 'src/app/core/security/authentication/jwt-auth.guard';



@Controller('me')
export class IdentityController {

    constructor(
        private readonly identity:
            IdentityService,
    ) { }

    @Get()
    getMe(@Req() request: AuthenticatedRequest) {
        return this.identity.getMe(request.auth!.sub);
    }
}