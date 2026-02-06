import { IsEnum, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { GetDocsDto } from '@shared/dtos/get-docs.dto';
import { TrimStringTransform } from '@core/transformers/trim-string.transformer';
import { UserRoles } from '@shared/constants/enums/user.enum';

export class GetUsersDto extends GetDocsDto {
  @IsOptional()
  @IsEnum(UserRoles)
  role?: UserRoles;

  @IsOptional()
  @Transform(TrimStringTransform)
  email?: string;

  @IsOptional()
  @Transform(TrimStringTransform)
  name?: string;

  @IsOptional()
  isActive?: boolean;
}
