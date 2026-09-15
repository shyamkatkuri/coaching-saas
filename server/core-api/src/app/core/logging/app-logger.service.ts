import {
    Injectable,
    LoggerService,
} from '@nestjs/common';

import { RequestContextService } from '../context/request-context.service';

@Injectable()
export class AppLoggerService
    implements LoggerService {
    constructor(
        private readonly context:
            RequestContextService,
    ) { }

    private write(
        level: string,
        message: unknown,
        context?: string,
        trace?: string,
    ): void {
        const log = {
            timestamp:
                new Date().toISOString(),

            level,

            correlationId:
                this.context.getCorrelationId(),

            context,

            message:
                typeof message === 'string'
                    ? message
                    : JSON.stringify(message),

            ...(trace
                ? { trace }
                : {}),
        };

        console.log(
            JSON.stringify(log),
        );
    }

    log(
        message: unknown,
        context?: string,
    ): void {
        this.write(
            'INFO',
            message,
            context,
        );
    }

    error(
        message: unknown,
        trace?: string,
        context?: string,
    ): void {
        this.write(
            'ERROR',
            message,
            context,
            trace,
        );
    }

    warn(
        message: unknown,
        context?: string,
    ): void {
        this.write(
            'WARN',
            message,
            context,
        );
    }

    debug(
        message: unknown,
        context?: string,
    ): void {
        this.write(
            'DEBUG',
            message,
            context,
        );
    }

    verbose(
        message: unknown,
        context?: string,
    ): void {
        this.write(
            'VERBOSE',
            message,
            context,
        );
    }
}