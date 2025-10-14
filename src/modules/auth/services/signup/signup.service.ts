import { BasicUserDto } from '@modules/auth/dtos/basicUserData.dto';
import { UserRepository } from '@modules/users/repositories/user.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SignupService {
  constructor(private userRepo: UserRepository) {}

  async varifyNewUserData(basicUserDto: BasicUserDto) {
    // check if the
    const user = await this.userRepo.findOne(basicUserDto.email);
    if (user) throw new Error('User with this email already exists');
    // other logics ----

    return { message: 'User data varified' };
  }

  // signup logic
  async signup(userData: any) {
    // get token and extract email out of it
    // get user data
    // check if the password is strong, else throw error
    // validate other user data's: firstname, lastName, phonenumber
    // (email in token is already validated and so that user is varified)
    // check if the user with given email existed
    // check if the user with given phonenumber existed
    // has user password
    // creae user in db
    // create a REFRESH TOKEN and ACCESS TOKEN
    // add token in cookie as http only
    // return the token and singup success message
    return await this.userRepo.create(userData);
  }
}
