import type { Config } from '@jest/types';
import { debug as _debug } from 'debug';
import { RedisContainer } from '@testcontainers/redis';
import { Redis } from 'ioredis';

const debug = _debug('jest-redis:setup:custom');

export default async (
  globalConfig: Config.GlobalConfig,
  projectConfig: Config.ProjectConfig,
): Promise<void> => {
  // For outputting next debug message on a new line
  debug('');
  debug('standalone setup.ts');

  const password = process.env['REDIS_PASSWORD'];

  /**
   * Starts Redis on a port 6379 inside container and maps it to a random port on host.
   * https://github.com/testcontainers/testcontainers-node/blob/main/packages/modules/redis/src/redis-container.ts
   */
  let redis = new RedisContainer('redis:7.4.0-alpine3.20');
  if (password != null) {
    redis = redis.withPassword(password);
  }
  const startedRedis = await redis.start();

  globalThis.__REDIS_TESTCONTAINER__ = startedRedis;

  const host = startedRedis.getHost();
  const hostPort = startedRedis.getMappedPort(6379);
  try {
    const connection = new Redis({
      host,
      port: hostPort,
      ...(password != null ? { password } : {}),
      lazyConnect: true,
    });
    await connection.connect();
    debug('connection successful');
    connection.disconnect();
  } catch (e) {
    debug('connection error', e);
    throw e;
  }
};
