import {
  IsNotEmpty,
  IsDate,
  IsArray,
  IsOptional,
  IsString,
} from 'class-validator';
import { OmitType, PartialType } from '@nestjs/swagger';

export class CreateFeedDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsArray()
  newspapers: string[];

  @IsOptional()
  @IsArray()
  articles: string[];

  @IsOptional()
  @IsDate()
  lastUpdate: Date;

  @IsOptional()
  @IsDate()
  created: Date;
}

export class UpdateFeedDto extends PartialType(
  OmitType(CreateFeedDto, ['articles', 'newspapers']),
) {}

export class AddArticleToFeedDto {
  @IsNotEmpty()
  @IsString()
  readonly article: string;
}

export class AddNewspaperToFeedDto {
  @IsNotEmpty()
  @IsString()
  readonly newspaper: string;
}
