import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateNewspaperDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  description: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  category: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  country: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  lang: string;

  @IsNotEmpty()
  @IsUrl()
  @ApiProperty()
  url: string;

  @IsOptional()
  @IsDate()
  @ApiProperty()
  lastUpdate: Date;

  @IsOptional()
  @IsDate()
  @ApiProperty()
  created: Date;
}

export class UpdateNewspaperDto extends PartialType(CreateNewspaperDto) {}
