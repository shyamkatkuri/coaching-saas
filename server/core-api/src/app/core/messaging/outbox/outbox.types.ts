import type {
    IntegrationEventEnvelope,
} from '@coaching/contracts';

export interface PendingOutboxEvent {

    id: string;

    topic: string;

    eventKey: string;

    eventType: string;

    eventVersion:
    number;

    payload:
    IntegrationEventEnvelope;

    headers:
    Record<
        string,
        string
    >;

    attempts:
    number;
}

export interface CreateOutboxEvent {

    id: string;

    topic: string;

    eventKey: string;

    eventType: string;

    eventVersion:
    number;

    payload:
    IntegrationEventEnvelope;

    headers:
    Record<
        string,
        string
    >;
}