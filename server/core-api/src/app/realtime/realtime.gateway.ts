import {
    Logger,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';

import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsException,
} from '@nestjs/websockets';

import type {
    Server,
} from 'socket.io';

import {
    REALTIME_EVENTS,
} from '@coaching/contracts';

import type {
    AuthenticatedSocket,
} from './models/authenticated-socket.model';

import {
    JoinRealtimeScopeDto,
} from './dto/join-realtime-scope.dto';

import {
    SocketAuthService,
} from './socket-auth.service';

import {
    RealtimeScopeService,
} from './realtime-scope.service';

import {
    RealtimeRoomFactory,
} from './realtime-room.factory';

import {
    RealtimePublisherService,
} from './realtime-publisher.service';

import {
    randomUUID,
} from 'node:crypto';

@WebSocketGateway({

    namespace:
        '/realtime',

    transports: [
        'websocket',
    ],
})
export class RealtimeGateway
    implements
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect {

    private readonly logger =
        new Logger(
            RealtimeGateway.name,
        );

    @WebSocketServer()
    server!: Server;

    constructor(
        private readonly auth:
            SocketAuthService,

        private readonly scopes:
            RealtimeScopeService,

        private readonly rooms:
            RealtimeRoomFactory,

        private readonly publisher:
            RealtimePublisherService,
    ) { }

    afterInit(
        server:
            Server,
    ): void {

        this.publisher
            .attachServer(
                server,
            );

        this.logger.log(
            'Realtime gateway initialized',
        );
    }

    async handleConnection(
        client:
            AuthenticatedSocket,
    ): Promise<void> {

        try {

            const principal =
                await this.auth
                    .authenticate(
                        client,
                    );

            client.data.principal =
                principal;

            /*
             * Every authenticated user
             * gets a private room.
             */
            await client.join(
                this.rooms.user(
                    principal
                        .applicationUserId,
                ),
            );

            client.emit(
                REALTIME_EVENTS
                    .CONNECTED,

                {
                    eventId:
                        randomUUID(),

                    event:
                        REALTIME_EVENTS
                            .CONNECTED,

                    version:
                        1,

                    occurredAt:
                        new Date()
                            .toISOString(),

                    data: {
                        socketId:
                            client.id,

                        applicationUserId:
                            principal
                                .applicationUserId,
                    },
                },
            );

            this.logger.log(
                `Socket connected ${client.id}`,
            );

        } catch (error) {

            this.logger.warn(
                `Rejected socket ${client.id}`,
            );

            client.emit(
                'system.error',
                {
                    code: 'UNAUTHORIZED',
                    message: 'Socket authentication failed',
                },
            );

            client.disconnect(
                true,
            );
        }
    }

    handleDisconnect(
        client:
            AuthenticatedSocket,
    ): void {

        this.logger.log(
            `Socket disconnected ${client.id}`,
        );
    }

    @UsePipes(
        new ValidationPipe({
            whitelist:
                true,

            forbidNonWhitelisted:
                true,

            transform:
                true,
        }),
    )
    @SubscribeMessage(
        'scope.join',
    )
    async joinScope(
        @ConnectedSocket()
        client:
            AuthenticatedSocket,

        @MessageBody()
        dto:
            JoinRealtimeScopeDto,
    ) {

        const principal =
            client.data
                .principal;

        if (!principal) {

            throw new WsException(
                'Socket is not authenticated',
            );
        }

        await this.scopes
            .assertOrganizationAccess(
                principal
                    .applicationUserId,

                dto.organizationId,
            );

        await client.join(
            this.rooms
                .organization(
                    dto.organizationId,
                ),
        );

        if (
            dto.branchId
        ) {

            await this.scopes
                .assertBranchAccess(
                    principal
                        .applicationUserId,

                    dto.organizationId,

                    dto.branchId,
                );

            await client.join(
                this.rooms.branch(
                    dto.organizationId,
                    dto.branchId,
                ),
            );
        }

        return {

            ok:
                true,

            organizationId:
                dto.organizationId,

            branchId:
                dto.branchId ??
                null,
        };
    }

    @SubscribeMessage(
        'scope.leave',
    )
    async leaveScope(
        @ConnectedSocket()
        client:
            AuthenticatedSocket,

        @MessageBody()
        dto:
            JoinRealtimeScopeDto,
    ) {

        await client.leave(
            this.rooms
                .organization(
                    dto.organizationId,
                ),
        );

        if (
            dto.branchId
        ) {

            await client.leave(
                this.rooms.branch(
                    dto.organizationId,
                    dto.branchId,
                ),
            );
        }

        return {
            ok:
                true,
        };
    }

    @SubscribeMessage(
        'ping',
    )
    ping() {

        return {

            ok:
                true,

            timestamp:
                new Date()
                    .toISOString(),
        };
    }
}