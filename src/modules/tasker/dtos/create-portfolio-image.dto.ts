import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePortfolioImageDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  caption?: string;
}
