import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthModule } from './health/health.module.js';
import { GameModule } from './game/game.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres' as const,
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USER', 'kgame'),
        password: config.get<string>('DB_PASSWORD', 'kgame'),
        database: config.get<string>('DB_NAME', 'kgame'),
        autoLoadEntities: true,
        // Solo para desarrollo: en producción usar migraciones.
        synchronize: config.get<string>('NODE_ENV') !== 'production',
      }),
    }),
    HealthModule,
    GameModule,
  ],
})
export class AppModule {}
