import {
  IsNotEmpty,
  IsDate,
  IsArray,
  IsOptional,
  IsString,
  IsBoolean,
} from 'class-validator';
import { OmitType, PartialType, ApiProperty } from '@nestjs/swagger';

export class CreateFeedDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  description: string;

  @IsOptional()
  @IsArray()
  @ApiProperty()
  newspapers: string[];

  @IsOptional()
  @IsDate()
  @ApiProperty()
  lastUpdate: Date;

  @IsOptional()
  @IsDate()
  @ApiProperty()
  created: Date;
}

export class UpdateFeedDto extends PartialType(
  OmitType(CreateFeedDto, ['newspapers']),
) {}

export class AddNewspaperToFeedDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly newspaper: string;
}

export class FeedQueryOptions {
  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  populateNewspapers: boolean;
}
