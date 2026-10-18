import type {
    Socket,
} from 'socket.io';

export interface RealtimePrincipal {

    applicationUserId:
    string;

    keycloakUserId:
    string;

    email:
    string | null;
}

export interface RealtimeSocketData {

    principal?:
    RealtimePrincipal;
}

export type AuthenticatedSocket = Socket;