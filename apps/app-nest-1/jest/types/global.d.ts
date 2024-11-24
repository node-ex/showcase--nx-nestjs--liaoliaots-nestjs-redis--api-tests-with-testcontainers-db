import type { Redis } from 'ioredis';
import { StartedRedisContainer } from '@testcontainers/redis';

declare global {
  /**
   * Available in the global Node.js context
   */
  // eslint-disable-next-line no-var
  var __REDIS_TESTCONTAINER__: StartedRedisContainer;

  /**
   * Available in the isolated test context
   */
  // eslint-disable-next-line no-var
  var __IOREDIS_CONNECTION__: Redis;
}

export {};
