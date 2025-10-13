import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/modules/users/repositories/user.repository';

@Injectable()
export class AuthService {
  constructor(private userRepo: UserRepository) {}
}
