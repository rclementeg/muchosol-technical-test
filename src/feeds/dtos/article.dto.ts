import {
  IsString,
  IsNotEmpty,
  IsUrl,
  IsMongoId,
  IsDate,
  IsOptional,
  IsPositive,
  Min,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateArticleDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty()
  newspaper: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  subtitle: string;

  @IsOptional()
  @IsDate()
  @ApiProperty()
  date: Date;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  author: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  category: string;

  @IsNotEmpty()
  @IsUrl()
  @ApiProperty()
  image: string;

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

export class UpdateArticleDto extends PartialType(CreateArticleDto) {}

export class PaginationArticlesDto {
  @IsOptional()
  @IsPositive()
  @ApiProperty()
  limit: number;

  @IsOptional()
  @Min(0)
  @ApiProperty()
  offset: number;
}
