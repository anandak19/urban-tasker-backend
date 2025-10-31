import { type IUserService } from '@modules/users/interfaces/user-services.interface';
import { USER_TOKENS } from '@modules/users/user-tokens';
import { Inject } from '@nestjs/common';
import { ValidatorConstraintInterface } from 'class-validator';

export class IsEmailExists implements ValidatorConstraintInterface {
  constructor(
    @Inject(USER_TOKENS.SERVICE) private _userService: IUserService,
  ) {}

  async validate(value: string): Promise<boolean> {
    const user = await this._userService.findByEmail(value);
    return user ? true : false;
  }
}
