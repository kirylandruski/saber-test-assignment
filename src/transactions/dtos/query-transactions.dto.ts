import { IsString, IsInt, Min, Max, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryTransactionsDto {
  @IsInt()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  limit: number;

  @IsString()
  @IsOptional()
  after?: string;
}
