import { IsInt, IsString } from "class-validator";

export class EnvironmentVariables {
    // @IsString()
    // DATABASE_URL: string;

    // @IsString()
    // DATABASE_ENTITIES: string;

    // @IsString()
    // DATABASE_MIGRATIONS: string;

    // @IsString()
    // DATABASE_SYNCHRONIZE: string;

    @IsString()
    DATABASE_HOST: string;

    @IsInt()
    DATABASE_PORT: number;

    @IsString()
    DATABASE_USER: string;

    @IsString()
    DATABASE_PASSWORD: string;

    @IsString()
    DATABASE_NAME: string;

    @IsInt()
    PORT: number;

    @IsString()
    JWT_SECRET: string;

    @IsString()
    JWT_EXPIRES_IN: string;

    // @IsString()
    // JWT_SECRET: string;

    // @IsString()
    // JWT_EXPIRES_IN: string;
}