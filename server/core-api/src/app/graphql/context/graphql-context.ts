import type {
    Request,
    Response,
} from 'express';

export interface GraphqlRequest
    extends Request {

    applicationUserId?:
    string;

    user?: {
        sub?: string;

        preferred_username?:
        string;

        email?: string;
    };
}

export interface AppGraphqlContext {

    req:
    GraphqlRequest;

    res:
    Response;
}