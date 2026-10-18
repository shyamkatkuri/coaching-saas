import {
    Injectable,
    computed,
    signal,
} from '@angular/core';

import {
    keycloak,
} from './keycloak.instance';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private initialized = false;

    private readonly authenticatedState =
        signal(false);

    private readonly usernameState =
        signal<string | null>(null);

    readonly authenticated =
        this.authenticatedState.asReadonly();

    readonly username =
        this.usernameState.asReadonly();

    readonly isLoggedIn =
        computed(
            () =>
                this.authenticatedState(),
        );

    async initialize():
        Promise<boolean> {
        if (this.initialized) {
            return this.authenticatedState();
        }

        const authenticated =
            await keycloak.init({
                onLoad:
                    'login-required',

                flow:
                    'standard',

                pkceMethod:
                    'S256',

                checkLoginIframe:
                    false,

                enableLogging:
                    true,
            });

        this.initialized =
            true;

        this.updateState(
            authenticated,
        );

        return authenticated;
    }

    private updateState(
        authenticated: boolean,
    ): void {
        this.authenticatedState.set(
            authenticated,
        );

        const parsed =
            keycloak.tokenParsed;

        this.usernameState.set(
            typeof parsed?.[
                'preferred_username'
            ] === 'string'
                ? parsed[
                'preferred_username'
                ]
                : null,
        );
    }

    async login(): Promise<void> {
        await keycloak.login({
            redirectUri:
                window.location.origin,
        });
    }

    async logout(): Promise<void> {
        await keycloak.logout({
            redirectUri:
                window.location.origin,
        });
    }

    async getValidAccessToken():
        Promise<string | null> {
        await keycloak
            .updateToken(
                30,
            );

        const token =
            keycloak.token;

        if (!token) {

            throw new Error(
                'Access token unavailable',
            );
        }

        return token;
    }

    getAccessToken():
        string | undefined {
        return keycloak.token;
    }

    getSubject():
        string | undefined {
        return keycloak.subject;
    }

    getTokenClaims() {
        return keycloak.tokenParsed;
    }
}