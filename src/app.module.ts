import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { EnvironmentVariables } from './enviroment-variables';
import { validateSync } from 'class-validator';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.dev.env',
      validate: (rawConfig) => {
        const config = plainToInstance(EnvironmentVariables, rawConfig, {
          enableImplicitConversion: true,
        });

        const error = validateSync(config);
        if (error.length > 0) throw new Error(error.toString());

        return config;
      }
    }),
    DatabaseModule,
    UsersModule,
  ],
})
export class AppModule {}
