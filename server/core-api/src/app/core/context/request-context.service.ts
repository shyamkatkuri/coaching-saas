import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';

@Injectable()
export class RequestContextService {
    private readonly storage =
        new AsyncLocalStorage<Map<string, string>>();

    run(
        correlationId: string,
        callback: () => void,
    ): void {
        const store = new Map<string, string>();

        store.set(
            'correlationId',
            correlationId,
        );

        this.storage.run(
            store,
            callback,
        );
    }

    getCorrelationId(): string | undefined {
        return this.storage
            .getStore()
            ?.get('correlationId');
    }
}