import { UsersService } from '@modules/users/services/users.service';
import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsEmailUnique implements ValidatorConstraintInterface {
  constructor(private readonly _userService: UsersService) {}

  async validate(email: string) {
    const user = await this._userService.findByEmail(email);
    return !user;
  }
}
