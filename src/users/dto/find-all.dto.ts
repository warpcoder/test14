import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsNumberString, IsOptional, IsString } from "class-validator";

export class FindAllDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ required: false })
  @IsNumberString()
  @IsOptional()
  page?: number | null = null;

  @ApiProperty({ required: false })
  @IsNumberString()
  @IsOptional()
  limit?: number | null = null;
}