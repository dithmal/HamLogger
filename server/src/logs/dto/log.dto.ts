import { Transform, Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import {
  IsEnum,
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsUUID,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min
} from 'class-validator';
import { Band, QslReceivedStatus, QslSentStatus, QslVia } from '@prisma/client';

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;

const normalize = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim().toUpperCase() : value;

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class CreateLogDto {
  @Transform(normalize)
  @IsString()
  @MaxLength(32)
  call!: string;

  @Matches(DATE_PATTERN)
  qsoDate!: string;

  @Matches(TIME_PATTERN)
  timeOn!: string;

  @IsEnum(Band)
  band!: Band;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 6 })
  @Min(0)
  freq!: number;

  @Transform(normalize)
  @IsString()
  @MaxLength(32)
  mode!: string;

  @Transform(trim)
  @IsString()
  @MaxLength(8)
  rstSent!: string;

  @Transform(trim)
  @IsString()
  @MaxLength(8)
  rstRcvd!: string;

  @Transform(normalize)
  @IsOptional()
  @IsString()
  @MaxLength(10)
  gridsquare?: string | null;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  dxcc?: number | null;

  @Transform(trim)
  @IsOptional()
  @IsString()
  @MaxLength(128)
  name?: string | null;

  @Transform(trim)
  @IsOptional()
  @IsString()
  @MaxLength(128)
  qth?: string | null;

  @Transform(normalize)
  @IsOptional()
  @IsString()
  @MaxLength(16)
  propMode?: string | null;

  @Transform(normalize)
  @IsOptional()
  @IsString()
  @MaxLength(32)
  submode?: string | null;

  @IsOptional()
  @IsString()
  comment?: string | null;

  @Transform(normalize)
  @IsString()
  @MaxLength(32)
  stationCallsign!: string;

  @Transform(normalize)
  @IsString()
  @MaxLength(32)
  operator!: string;

  @IsOptional()
  @IsEnum(QslReceivedStatus)
  qslRcvd?: QslReceivedStatus;

  @IsOptional()
  @IsEnum(QslSentStatus)
  qslSent?: QslSentStatus;

  @IsOptional()
  @IsEnum(QslVia)
  qslRcvdVia?: QslVia | null;

  @IsOptional()
  @IsEnum(QslVia)
  qslSentVia?: QslVia | null;

  @IsOptional()
  @Matches(DATE_PATTERN)
  qslRdate?: string | null;

  @IsOptional()
  @Matches(DATE_PATTERN)
  qslSdate?: string | null;
}

export class UpdateLogDto extends PartialType(CreateLogDto) {}

export class ListLogsQueryDto {
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;

  @IsOptional()
  @Transform(normalize)
  @IsString()
  call?: string;

  @IsOptional()
  @IsEnum(QslSentStatus)
  qslSent?: QslSentStatus;

  @IsOptional()
  @IsEnum(QslReceivedStatus)
  qslRcvd?: QslReceivedStatus;

  @IsOptional()
  @Matches(DATE_PATTERN)
  qsoDateFrom?: string;

  @IsOptional()
  @Matches(DATE_PATTERN)
  qsoDateTo?: string;
}

export class BulkUpdateQslDto {
  @IsArray()
  @IsUUID('4', { each: true })
  ids!: string[];

  @IsOptional()
  @IsEnum(QslReceivedStatus)
  qslRcvd?: QslReceivedStatus;

  @IsOptional()
  @IsEnum(QslSentStatus)
  qslSent?: QslSentStatus;

  @IsOptional()
  @Matches(DATE_PATTERN)
  qslRdate?: string | null;

  @IsOptional()
  @Matches(DATE_PATTERN)
  qslSdate?: string | null;
}
