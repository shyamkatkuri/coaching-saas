import {
    SetMetadata,
} from '@nestjs/common';

import type {
    AccessRule,
} from './access-rule';

export const ACCESS_RULE_KEY =
    'accessRule';

export const RequireAccess = (
    rule: AccessRule,
) =>
    SetMetadata(
        ACCESS_RULE_KEY,
        rule,
    );