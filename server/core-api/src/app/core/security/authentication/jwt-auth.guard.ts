import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

import {
    Reflector,
} from '@nestjs/core';

import type {
    Request,
} from 'express';

import type {
    AuthPrincipal,
} from './auth-principal';

import {
    JwtVerifierService,
} from './jwt-verifier.service';

import {
    IS_PUBLIC_KEY,
} from './public.decorator';

export type AuthenticatedRequest =
    Request & {
        auth?: AuthPrincipal;

        applicationUserId?:
        string;
    };

@Injectable()
export class JwtAuthGuard
    implements CanActivate {
    constructor(
        private readonly verifier:
            JwtVerifierService,

        private readonly reflector:
            Reflector,
    ) { }

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const isPublic =
            this.reflector
                .getAllAndOverride<boolean>(
                    IS_PUBLIC_KEY,
                    [
                        context.getHandler(),
                        context.getClass(),
                    ],
                );

        if (isPublic) {
            return true;
        }

        const request =
            context
                .switchToHttp()
                .getRequest<
                    AuthenticatedRequest
                >();

        const authorization =
            request.headers
                .authorization;

        if (!authorization) {
            throw new UnauthorizedException(
                'Bearer token is required',
            );
        }

        const [
            scheme,
            token,
        ] =
            authorization
                .split(' ');

        if (
            scheme !== 'Bearer' ||
            !token
        ) {
            throw new UnauthorizedException(
                'Invalid Authorization header',
            );
        }

        request.auth =
            await this.verifier
                .verifyToken(token);

        return true;
    }
}