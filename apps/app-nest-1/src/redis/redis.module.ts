import { Module } from '@nestjs/common';
import { RedisController } from './redis.controller';
import { RedisModule as _RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [
    _RedisModule.forRootAsync({
      useFactory: () => {
        const mandatoryCredentials = [
          process.env['REDIS_HOST'],
          process.env['REDIS_PORT'],
        ];

        if (mandatoryCredentials.some((cred) => !cred)) {
          throw new Error('Missing mandatory Redis credentials');
        }

        const [host, portString] = mandatoryCredentials as [string, string];
        const password = process.env['REDIS_PASSWORD'];

        if (portString.match(/\D/)) {
          throw new Error('Invalid Redis port');
        }
        const port = parseInt(portString);

        return {
          config: {
            host,
            port,
            ...(password ? { password } : {}),
          },
        };
      },
    }),
  ],
  controllers: [RedisController],
  providers: [],
})
export class RedisModule {}
