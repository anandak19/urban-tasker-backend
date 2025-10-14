import { UserRepository } from '@modules/users/repositories/user.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private userRepo: UserRepository) {}
}
