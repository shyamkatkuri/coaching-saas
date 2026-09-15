import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
} from '@nestjs/common';

import {
    Request,
    Response,
} from 'express';

import {
    RequestContextService,
} from '../context/request-context.service';

import {
    AppLoggerService,
} from '../logging/app-logger.service';

@Catch()
export class GlobalExceptionFilter
    implements ExceptionFilter {
    constructor(
        private readonly requestContext:
            RequestContextService,

        private readonly logger:
            AppLoggerService,
    ) { }

    catch(
        exception: unknown,
        host: ArgumentsHost,
    ): void {
        const ctx =
            host.switchToHttp();

        const response =
            ctx.getResponse<Response>();

        const request =
            ctx.getRequest<Request>();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const exceptionResponse =
            exception instanceof HttpException
                ? exception.getResponse()
                : undefined;

        let message:
            | string
            | string[] =
            'Internal server error';

        if (
            typeof exceptionResponse ===
            'string'
        ) {
            message =
                exceptionResponse;
        } else if (
            exceptionResponse &&
            typeof exceptionResponse ===
            'object' &&
            'message' in exceptionResponse
        ) {
            message =
                (
                    exceptionResponse as {
                        message:
                        | string
                        | string[];
                    }
                ).message;
        }

        const correlationId =
            this.requestContext
                .getCorrelationId();

        const logMessage =
            exception instanceof Error
                ? exception.message
                : 'Unknown exception';

        if (status >= 500) {
            this.logger.error(
                logMessage,

                exception instanceof Error
                    ? exception.stack
                    : undefined,

                GlobalExceptionFilter.name,
            );
        } else {
            this.logger.warn(
                logMessage,
                GlobalExceptionFilter.name,
            );
        }

        response.status(
            status,
        ).json({
            statusCode: status,

            message,

            correlationId,

            timestamp:
                new Date().toISOString(),

            path:
                request.originalUrl,
        });
    }
}