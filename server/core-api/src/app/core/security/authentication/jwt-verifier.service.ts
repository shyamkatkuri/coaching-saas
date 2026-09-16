import {
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

import {
    ConfigService,
} from '@nestjs/config';

import {
    decode,
    verify,
} from 'jsonwebtoken';

import jwksClient, {
    JwksClient,
} from 'jwks-rsa';

import type {
    AuthPrincipal,
} from './auth-principal';

@Injectable()
export class JwtVerifierService {
    private readonly issuer:
        string;

    private readonly audience:
        string;

    private readonly jwks:
        JwksClient;

    constructor(
        private readonly config:
            ConfigService,
    ) {
        this.issuer =
            this.config.getOrThrow<string>(
                'KEYCLOAK_ISSUER',
            );

        this.audience =
            this.config.getOrThrow<string>(
                'KEYCLOAK_AUDIENCE',
            );

        this.jwks =
            jwksClient({
                jwksUri:
                    `${this.issuer}/protocol/openid-connect/certs`,

                cache: true,

                rateLimit: true,

                jwksRequestsPerMinute:
                    10,
            });
    }

    async verifyToken(
        token: string,
    ): Promise<AuthPrincipal> {
        const decoded = decode(
            token,
            {
                complete: true,
            },
        );

        if (
            !decoded ||
            typeof decoded === 'string'
        ) {
            console.error(
                '[JWT DEBUG] Token cannot be decoded',
            );

            throw new UnauthorizedException(
                'Invalid access token',
            );
        }

        console.log(
            '[JWT DEBUG] Header:',
            decoded.header,
        );

        const payload =
            decoded.payload;

        console.log(
            '[JWT DEBUG] Claims:',
            {
                iss:
                    typeof payload === 'object'
                        ? payload.iss
                        : undefined,

                aud:
                    typeof payload === 'object'
                        ? payload.aud
                        : undefined,

                sub:
                    typeof payload === 'object'
                        ? payload.sub
                        : undefined,

                azp:
                    typeof payload === 'object'
                        ? payload.azp
                        : undefined,

                exp:
                    typeof payload === 'object'
                        ? payload.exp
                        : undefined,

                currentTime:
                    Math.floor(
                        Date.now() / 1000,
                    ),
            },
        );

        console.log(
            '[JWT DEBUG] Expected:',
            {
                issuer:
                    this.issuer,

                audience:
                    this.audience,

                jwksUri:
                    `${this.issuer}/protocol/openid-connect/certs`,
            },
        );

        if (
            decoded.header.alg !==
            'RS256'
        ) {
            throw new UnauthorizedException(
                `Unsupported JWT algorithm: ${decoded.header.alg}`,
            );
        }

        const kid =
            decoded.header.kid;

        if (!kid) {
            throw new UnauthorizedException(
                'JWT key id is missing',
            );
        }

        try {
            console.log(
                '[JWT DEBUG] Looking for signing key:',
                kid,
            );

            const signingKey =
                await this.jwks
                    .getSigningKey(
                        kid,
                    );

            console.log(
                '[JWT DEBUG] Signing key found',
            );

            const publicKey =
                signingKey
                    .getPublicKey();

            const verifiedPayload =
                verify(
                    token,
                    publicKey,
                    {
                        algorithms: [
                            'RS256',
                        ],

                        issuer:
                            this.issuer,

                        audience:
                            this.audience,
                    },
                );

            console.log(
                '[JWT DEBUG] Token verification SUCCESS',
            );

            if (
                typeof verifiedPayload ===
                'string' ||
                !verifiedPayload.sub
            ) {
                throw new Error(
                    'JWT subject is missing',
                );
            }

            return verifiedPayload as
                AuthPrincipal;
        } catch (error) {
            console.error(
                '[JWT DEBUG] Verification FAILED:',
                error instanceof Error
                    ? {
                        name:
                            error.name,
                        message:
                            error.message,
                    }
                    : error,
            );

            throw new UnauthorizedException(
                'Access token is invalid or expired',
            );
        }
    }
}