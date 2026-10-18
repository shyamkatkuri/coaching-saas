import {
    Global,
    Module,
} from '@nestjs/common';

import {
    RealtimeGateway,
} from './realtime.gateway';

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
import { SecurityModule } from '../core/security/security.module';

@Global()
@Module({
    imports: [SecurityModule],
    providers: [

        RealtimeRoomFactory,

        SocketAuthService,

        RealtimeScopeService,

        RealtimePublisherService,

        RealtimeGateway,
    ],

    exports: [

        RealtimePublisherService,

        RealtimeRoomFactory,
    ],
})
export class RealtimeModule { }