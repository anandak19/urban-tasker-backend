import { Injectable, Scope } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable({ scope: Scope.TRANSIENT })
export class HashService {
  private readonly SALT_ROUNDS = 10;
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.SALT_ROUNDS);
    return bcrypt.hash(password, salt);
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
