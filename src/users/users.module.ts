import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { usersProviders } from './users.provider';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'src/enviroment-variables';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: ConfigService<EnvironmentVariables, true>) => ({
          global: true,
          secret: config.get('JWT_SECRET', { infer: true }),
          signOptions: {
            expiresIn: config.get('JWT_EXPIRES_IN', { infer: true }),
          },
        }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, ...usersProviders],
})
export class UsersModule {}
