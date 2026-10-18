import {
    ExecutionContext,
} from '@nestjs/common';

import {
    GqlContextType,
    GqlExecutionContext,
} from '@nestjs/graphql';

export function getExecutionRequest(
    context: ExecutionContext,
): any {

    if (
        context.getType<GqlContextType>() ===
        'graphql'
    ) {

        const gql =
            GqlExecutionContext.create(
                context,
            );

        return gql
            .getContext()
            .req;
    }

    return context
        .switchToHttp()
        .getRequest();
}

export function getExecutionParams(
    context: ExecutionContext,
): Record<string, any> {

    if (
        context.getType<GqlContextType>() ===
        'graphql'
    ) {

        return (
            GqlExecutionContext
                .create(context)
                .getArgs() ??
            {}
        );
    }

    return (
        context
            .switchToHttp()
            .getRequest()
            .params ??
        {}
    );
}

export function getExecutionOperation(
    context: ExecutionContext,
): string {

    if (
        context.getType<GqlContextType>() ===
        'graphql'
    ) {

        const info =
            GqlExecutionContext
                .create(context)
                .getInfo();

        return (
            `graphql:${info.fieldName}`
        );
    }

    const request =
        context
            .switchToHttp()
            .getRequest();

    return (
        `${request.method}:` +
        `${request.route?.path ?? request.path}`
    );
}