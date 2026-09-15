import {
    Injectable,
    NestMiddleware,
} from '@nestjs/common';

import {
    NextFunction,
    Request,
    Response,
} from 'express';

import { randomUUID } from 'node:crypto';

import { RequestContextService } from '../context/request-context.service';

@Injectable()
export class CorrelationIdMiddleware
    implements NestMiddleware {
    constructor(
        private readonly requestContext:
            RequestContextService,
    ) { }

    use(
        req: Request,
        res: Response,
        next: NextFunction,
    ): void {
        const incomingHeader =
            req.headers['x-correlation-id'];

        const incomingId =
            typeof incomingHeader === 'string'
                ? incomingHeader
                : undefined;

        const correlationId =
            incomingId &&
                incomingId.length <= 128
                ? incomingId
                : randomUUID();

        res.setHeader(
            'x-correlation-id',
            correlationId,
        );

        this.requestContext.run(
            correlationId,
            next,
        );
    }
}