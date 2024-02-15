import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsPhoneNumber, MinLength } from "class-validator";

export class SignInDto {
    @ApiProperty({ required: false })
    @IsEmail({}, { message: 'Invalid email' })
    @IsOptional()
    email?: string | null = null;

    @ApiProperty({ required: false })
    @IsPhoneNumber('RU', { message: 'Invalid phone number' })
    @IsOptional()
    phone?: string | null = null;

    @ApiProperty({ required: true })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;
}