import {
    Controller,
    UseFilters,
} from '@nestjs/common';

import {
    Ctx,
    EventPattern,
    KafkaContext,
    Payload,
} from '@nestjs/microservices';

import {
    INTEGRATION_TOPICS,
    type IntegrationEventEnvelope,
} from '@coaching/contracts';

import {
    AuditService,
} from '../application/audit.service';

import {
    AuditRetryFilter,
} from './audit-retry.filter';


@Controller()
@UseFilters(
    AuditRetryFilter,
)
export class AuditEventController {

    constructor(
        private readonly audit:
            AuditService,
    ) { }

    @EventPattern(
        INTEGRATION_TOPICS
            .ENROLLMENT,
    )
    enrollment(
        @Payload()
        event:
            IntegrationEventEnvelope,

        @Ctx()
        context:
            any,
    ) {

        return this.handle(
            event,
            context,
        );
    }

    @EventPattern(
        INTEGRATION_TOPICS
            .ATTENDANCE,
    )
    attendance(
        @Payload()
        event:
            IntegrationEventEnvelope,

        @Ctx()
        context:
            any,
    ) {

        return this.handle(
            event,
            context,
        );
    }

    @EventPattern(
        INTEGRATION_TOPICS
            .FEE,
    )
    fee(
        @Payload()
        event:
            IntegrationEventEnvelope,

        @Ctx()
        context:
            any,
    ) {

        return this.handle(
            event,
            context,
        );
    }

    @EventPattern(
        INTEGRATION_TOPICS
            .BATCH,
    )
    batch(
        @Payload()
        event:
            IntegrationEventEnvelope,

        @Ctx()
        context:
            any,
    ) {

        return this.handle(
            event,
            context,
        );
    }

    private async handle(
        event:
            IntegrationEventEnvelope,

        context:
            KafkaContext,
    ): Promise<void> {

        this.validate(
            event,
        );

        await this.audit.record(
            event,

            {
                topic:
                    context
                        .getTopic(),

                partition:
                    context
                        .getPartition(),

                offset:
                    context
                        .getMessage()
                        .offset,
            },
        );

        await this.commit(
            context,
        );
    }

    private validate(
        event:
            IntegrationEventEnvelope,
    ): void {

        if (
            !event?.eventId ||
            !event?.eventType ||
            !event?.aggregate?.id
        ) {

            throw new Error(
                'INVALID_INTEGRATION_EVENT',
            );
        }
    }

    private async commit(
        context:
            KafkaContext,
    ): Promise<void> {

        const message =
            context.getMessage();

        await context
            .getConsumer()
            .commitOffsets([
                {

                    topic:
                        context
                            .getTopic(),

                    partition:
                        context
                            .getPartition(),

                    offset:
                        (
                            Number(
                                message.offset,
                            ) +
                            1
                        ).toString(),
                },
            ]);
    }
}