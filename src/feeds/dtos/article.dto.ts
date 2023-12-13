import {
  IsString,
  IsNotEmpty,
  IsUrl,
  IsMongoId,
  IsDate,
  IsOptional,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateArticleDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsMongoId()
  newspaper: string;

  @IsNotEmpty()
  @IsString()
  subtitle: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsDate()
  @IsOptional()
  date: Date;

  @IsNotEmpty()
  @IsString()
  author: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsUrl()
  image: string;

  @IsNotEmpty()
  @IsUrl()
  url: string;
}

export class UpdateArticleDto extends PartialType(CreateArticleDto) {}
