import {
    Global,
    Module,
} from '@nestjs/common';

import {
    APP_GUARD,
} from '@nestjs/core';

import {
    JwtVerifierService,
} from './authentication/jwt-verifier.service';

import {
    JwtAuthGuard,
} from './authentication/jwt-auth.guard';

import {
    AuthorizationService,
} from './authorization/authorization.service';

import {
    AuthorizationGuard,
} from './authorization/authorization.guard';

@Global()
@Module({
    providers: [
        JwtVerifierService,

        AuthorizationService,

        {
            provide: APP_GUARD,

            useClass:
                JwtAuthGuard,
        },

        {
            provide: APP_GUARD,

            useClass:
                AuthorizationGuard,
        },
    ],

    exports: [
        AuthorizationService,
    ],
})
export class SecurityModule { }