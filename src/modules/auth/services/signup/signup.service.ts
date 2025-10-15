import { BasicUserDto } from '@modules/auth/dtos/basicUserData.dto';
import { CreateUserDto } from '@modules/users/dtos/create-user.dto';
import { UserRepository } from '@modules/users/repositories/user.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SignupService {
  constructor(private userRepo: UserRepository) {}

  async varifyNewUserData(basicUserDto: BasicUserDto) {
    // check if the
    const user = await this.userRepo.findOne(basicUserDto);
    if (user) throw new Error('User with this email already exists');
    // other logics ----

    return { message: 'User data varified' };
  }

  // signup logic
  async signup(userData: CreateUserDto) {
    return await this.userRepo.create(userData);
  }

  // --STEPPER SINGUP PROCESS
  /*
  . STEP 1: Basic Info Submission (POST /auth/signup/basic)
  - Client sends: firstName, lastName, email, phone.
  - Server: Validate input → Store in Redis (key based on email) → Generate/send OTP → Store OTP in Redis with TTL.
    both basic user and otp and stored separatly
  - return the message: otp send to email

  . SETP 2: OTP Verification (POST /auth/signup/varify)
  - Client sends: email, otp.
  - Server: Fetch OTP from Redis → Validate match/expiration 
    If valid, mark "user data" in Redis as verified: true then Delete OTP key from redis.
    if not valid, send error message

  . STEP 3: Password Submission (POST /auth/signup)
  - Client sends: email, password.
    Server: Check if verified in Redis -> by geting the user data from redis using email
  - If varifid, Validate password strength
  - If strength is good, Fetch full user data from Redis
  - Then Hash password → Create user in DB → Delete Redis keys.
  
  SIGNUP IS NOW COMPLETED
  NEXT MAKE THE USER LOGIN AFTER SINGUP
  . create a REFRESH TOKEN and ACCESS TOKEN
  . add token in cookie as http only
  . return the token and singup success message

  */
}
