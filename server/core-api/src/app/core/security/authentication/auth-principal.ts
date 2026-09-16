export interface AuthPrincipal {
    sub: string;

    iss: string;

    aud:
    | string
    | string[];

    exp: number;

    iat?: number;

    email?: string;

    preferred_username?: string;
}