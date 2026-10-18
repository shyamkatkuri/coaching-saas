import {
    Injectable,
} from '@angular/core';

import {
    fromEvent,
    map,
    Observable,
    filter,
} from 'rxjs';

import type {
    RealtimeEnvelope,
    RealtimeEventName,
} from '@coaching/contracts';

@Injectable({
    providedIn:
        'root',
})
export class RealtimeBridgeService {

    private readonly events$ =
        fromEvent<
            CustomEvent<
                RealtimeEnvelope
            >
        >(
            window,
            'coaching:realtime',
        )
            .pipe(
                map(
                    event =>
                        event.detail,
                ),
            );

    on<T>(
        eventName:
            RealtimeEventName,
    ): Observable<
        RealtimeEnvelope<T>
    > {

        return this.events$
            .pipe(

                filter(
                    event =>
                        event.event ===
                        eventName,
                ),

                map(
                    event =>
                        event as
                        RealtimeEnvelope<T>,
                ),
            );
    }
}