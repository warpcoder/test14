import { ApiProperty } from "@nestjs/swagger";

export class FindAllDto {
  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  email?: string;

  @ApiProperty({ required: false })
  phone?: string;

  @ApiProperty({ required: false })
  page?: number | null = null;

  @ApiProperty({ required: false })
  limit?: number | null = null;
}