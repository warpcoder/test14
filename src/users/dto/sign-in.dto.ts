import { ApiProperty } from "@nestjs/swagger";

export class SignInDto {
    @ApiProperty({ required: false })
    email?: string | null = null;

    @ApiProperty({ required: false })
    phone?: string | null = null;

    @ApiProperty({ required: true })
    password: string;
}