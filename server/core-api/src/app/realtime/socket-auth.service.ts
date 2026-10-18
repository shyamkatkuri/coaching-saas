import {
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

import {
    DATABASES,
} from '../core/database/database.constants';

import {
    DatabaseRegistryService,
} from '../core/database/database-registry.service';

import {
    JwtVerifierService,
} from '../core/security/authentication/jwt-verifier.service';

import type {
    AuthenticatedSocket,
    RealtimePrincipal,
} from './models/authenticated-socket.model';

@Injectable()
export class SocketAuthService {

    constructor(
        private readonly jwt:
            JwtVerifierService,

        private readonly databases:
            DatabaseRegistryService,
    ) { }

    async authenticate(
        client:
            AuthenticatedSocket,
    ): Promise<
        RealtimePrincipal
    > {

        const token =
            this.extractToken(
                client,
            );

        if (!token) {

            throw new UnauthorizedException(
                'Access token is required',
            );
        }

        const claims =
            await this.jwt.verifyToken(
                token,
            );

        if (
            !claims?.sub
        ) {

            throw new UnauthorizedException(
                'Invalid access token',
            );
        }

        const userDb =
            this.databases.getPool(
                DATABASES.USER,
            );

        const result =
            await userDb.query(
                `
        SELECT
          id,
          keycloak_user_id,
          email,
          status

        FROM users

        WHERE keycloak_user_id = $1
          AND status = 'ACTIVE'

        LIMIT 1
        `,
                [
                    claims.sub,
                ],
            );

        if (
            result.rowCount === 0
        ) {

            throw new UnauthorizedException(
                'Application user not found',
            );
        }

        const user =
            result.rows[0];

        return {

            applicationUserId:
                user.id,

            keycloakUserId:
                user.keycloak_user_id,

            email:
                user.email ??
                null,
        };
    }

    private extractToken(
        client:
            AuthenticatedSocket,
    ): string | null {

        const authToken =
            client.handshake
                .auth?.token;

        if (
            typeof authToken ===
            'string' &&
            authToken.length > 0
        ) {

            return authToken;
        }

        const authorization =
            client.handshake
                .headers
                .authorization;

        if (
            authorization
                ?.startsWith(
                    'Bearer ',
                )
        ) {

            return authorization
                .slice(7);
        }

        return null;
    }
}