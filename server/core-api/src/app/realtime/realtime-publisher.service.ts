import {
    Injectable,
    Logger,
} from '@nestjs/common';

import {
    randomUUID,
} from 'node:crypto';

import type {
    Server,
} from 'socket.io';

import {
    RealtimeEnvelope,
    RealtimeEventName,
} from '@coaching/contracts';

import {
    RealtimeRoomFactory,
} from './realtime-room.factory';

@Injectable()
export class RealtimePublisherService {

    private readonly logger =
        new Logger(
            RealtimePublisherService.name,
        );

    private server?:
        Server;

    constructor(
        private readonly rooms:
            RealtimeRoomFactory,
    ) { }

    attachServer(
        server:
            Server,
    ): void {

        this.server =
            server;
    }

    emitToUser<T>(
        applicationUserId:
            string,

        event:
            RealtimeEventName,

        data:
            T,
    ): void {

        if (!this.server) {
            return;
        }

        this.server
            .to(
                this.rooms.user(
                    applicationUserId,
                ),
            )
            .emit(
                event,
                this.envelope(
                    event,
                    data,
                ),
            );
    }

    emitToOrganization<T>(
        organizationId:
            string,

        event:
            RealtimeEventName,

        data:
            T,
    ): void {

        if (!this.server) {
            return;
        }

        this.server
            .to(
                this.rooms
                    .organization(
                        organizationId,
                    ),
            )
            .emit(
                event,

                this.envelope(
                    event,
                    data,
                    organizationId,
                ),
            );
    }

    emitToBranch<T>(
        organizationId:
            string,

        branchId:
            string,

        event:
            RealtimeEventName,

        data:
            T,
    ): void {

        if (!this.server) {
            return;
        }

        this.server
            .to(
                this.rooms.branch(
                    organizationId,
                    branchId,
                ),
            )
            .emit(
                event,

                this.envelope(
                    event,
                    data,
                    organizationId,
                    branchId,
                ),
            );
    }

    private envelope<T>(
        event:
            RealtimeEventName,

        data:
            T,

        organizationId?:
            string,

        branchId?:
            string,
    ): RealtimeEnvelope<T> {

        return {

            eventId:
                randomUUID(),

            event,

            version:
                1,

            occurredAt:
                new Date()
                    .toISOString(),

            organizationId,

            branchId,

            data,
        };
    }
}