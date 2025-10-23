import { type IUserService } from '@modules/users/interfaces/user-service.interface';
import { Inject, Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsEmailUnique implements ValidatorConstraintInterface {
  constructor(
    @Inject('IUserService') private readonly _userService: IUserService,
  ) {}

  async validate(email: string) {
    const user = await this._userService.findByEmail(email);
    return !user;
  }
}
