import { PartialType } from '@nestjs/swagger';
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
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsString()
  country: string;

  @IsNotEmpty()
  @IsString()
  lang: string;

  @IsNotEmpty()
  @IsUrl()
  url: string;

  @IsOptional()
  @IsDate()
  lastUpdate: Date;

  @IsOptional()
  @IsDate()
  created: Date;
}

export class UpdateNewspaperDto extends PartialType(CreateNewspaperDto) {}
