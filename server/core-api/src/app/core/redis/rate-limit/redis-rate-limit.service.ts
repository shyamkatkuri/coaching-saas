import {
    Injectable,
} from '@nestjs/common';

import {
    RedisService,
} from '../redis.service';

const RATE_LIMIT_SCRIPT = `
local current =
  redis.call(
    'INCR',
    KEYS[1]
  )

if current == 1 then
  redis.call(
    'PEXPIRE',
    KEYS[1],
    ARGV[1]
  )
end

local ttl =
  redis.call(
    'PTTL',
    KEYS[1]
  )

return {
  current,
  ttl
}
`;

export interface RateLimitResult {

    current: number;

    remaining: number;

    ttlMs: number;

    allowed: boolean;
}

@Injectable()
export class RedisRateLimitService {

    constructor(
        private readonly redis:
            RedisService,
    ) { }

    async consume(
        key: string,
        limit: number,
        windowMs: number,
    ): Promise<
        RateLimitResult
    > {

        const result =
            await this.redis.eval(
                RATE_LIMIT_SCRIPT,
                [
                    key,
                ],
                [
                    String(
                        windowMs,
                    ),
                ],
            ) as [
                number,
                number,
            ];

        const current =
            Number(
                result[0],
            );

        const ttlMs =
            Number(
                result[1],
            );

        return {
            current,

            remaining:
                Math.max(
                    limit -
                    current,
                    0,
                ),

            ttlMs,

            allowed:
                current <=
                limit,
        };
    }
}