import {
    Injectable,
    inject,
    signal,
} from '@angular/core';

import {
    io,
    Socket,
} from 'socket.io-client';

import {
    REALTIME_EVENTS,
    RealtimeEnvelope,
} from '@coaching/contracts';

import {
    AuthService,
} from '../auth/auth.service';

interface RealtimeScope {

    organizationId:
    string;

    branchId?:
    string;
}

@Injectable({
    providedIn:
        'root',
})
export class RealtimeService {

    private readonly auth =
        inject(
            AuthService,
        );

    private socket:
        Socket | null =
        null;

    private readonly scopes =
        new Map<
            string,
            RealtimeScope
        >();

    readonly connected =
        signal(false);

    async connect():
        Promise<void> {

        if (
            this.socket
                ?.connected
        ) {
            return;
        }

        const token =
            await this.auth
                .getValidAccessToken();

        const socket =
            io(
                'http://localhost:3001/realtime',

                {
                    transports: [
                        'websocket',
                    ],

                    autoConnect:
                        false,

                    auth: {
                        token,
                    },

                    reconnection:
                        true,

                    reconnectionAttempts:
                        Infinity,

                    reconnectionDelay:
                        1_000,

                    reconnectionDelayMax:
                        5_000,

                    timeout:
                        10_000,
                },
            );

        this.socket =
            socket;

        this.registerListeners(
            socket,
        );

        socket.connect();
    }

    async joinScope(
        organizationId:
            string,

        branchId?:
            string,
    ): Promise<void> {

        const key =
            branchId
                ? `${organizationId}:${branchId}`
                : organizationId;

        this.scopes.set(
            key,
            {
                organizationId,
                branchId,
            },
        );

        if (
            this.socket
                ?.connected
        ) {

            this.emitJoin(
                {
                    organizationId,
                    branchId,
                },
            );
        }
    }

    leaveScope(
        organizationId:
            string,

        branchId?:
            string,
    ): void {

        const key =
            branchId
                ? `${organizationId}:${branchId}`
                : organizationId;

        this.scopes.delete(
            key,
        );

        this.socket?.emit(
            'scope.leave',

            {
                organizationId,
                branchId,
            },
        );
    }

    disconnect():
        void {

        this.socket
            ?.disconnect();

        this.socket =
            null;

        this.connected
            .set(false);
    }

    private registerListeners(
        socket:
            Socket,
    ): void {

        socket.on(
            'connect',

            () => {

                this.connected
                    .set(true);

                /*
                 * Rooms are not persisted
                 * after a new connection.
                 *
                 * Rejoin on every reconnect.
                 */
                for (
                    const scope
                    of this.scopes
                        .values()
                ) {

                    this.emitJoin(
                        scope,
                    );
                }
            },
        );

        socket.on(
            'disconnect',

            () => {

                this.connected
                    .set(false);
            },
        );

        socket.on(
            'connect_error',

            async () => {

                try {

                    const token =
                        await this.auth
                            .getValidAccessToken();

                    socket.auth = {
                        token,
                    };

                } catch {
                    // Existing auth flow
                    // handles login state.
                }
            },
        );

        socket.io.on(
            'reconnect_attempt',

            async () => {

                try {

                    const token =
                        await this.auth
                            .getValidAccessToken();

                    socket.auth = {
                        token,
                    };

                } catch {
                    // Ignore here.
                }
            },
        );

        for (
            const event
            of Object.values(
                REALTIME_EVENTS,
            )
        ) {

            socket.on(
                event,

                (
                    message:
                        RealtimeEnvelope,
                ) => {

                    this.bridgeToMfes(
                        message,
                    );
                },
            );
        }
    }

    private emitJoin(
        scope:
            RealtimeScope,
    ): void {

        this.socket?.emit(
            'scope.join',

            scope,

            (
                response:
                    unknown,
            ) => {

                console.debug(
                    'Realtime scope joined',
                    response,
                );
            },
        );
    }

    private bridgeToMfes(
        envelope:
            RealtimeEnvelope,
    ): void {

        window.dispatchEvent(
            new CustomEvent(
                'coaching:realtime',

                {
                    detail:
                        envelope,
                },
            ),
        );
    }
}