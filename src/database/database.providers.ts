import { Sequelize } from "sequelize-typescript";
import { ConfigService } from "@nestjs/config";
import { EnvironmentVariables } from "src/enviroment-variables";
import { User } from "src/users/entities/user.entity";

export const databaseProviders = [
    {
        provide: "SEQUELIZE",
        useFactory: async (configService: ConfigService<EnvironmentVariables, true>) => {
            const sequelize = new Sequelize({
                dialect: "postgres",
                host: configService.get("DATABASE_HOST"),
                port: configService.get("DATABASE_PORT"),
                username: configService.get("DATABASE_USER"),
                password: configService.get("DATABASE_PASSWORD"),
                database: configService.get("DATABASE_NAME"),
                models: [User],
            });
            // sequelize.addModels([User]);
            // await sequelize.sync();
            return sequelize;
        },
        inject: [ConfigService],
    },
]