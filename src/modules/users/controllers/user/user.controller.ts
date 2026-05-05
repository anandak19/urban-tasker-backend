import { AuthGuard } from '@core/guards/auth/auth.guard';
import { ImageValidationPipe } from '@core/pipes/image-validation.pipe';
import { ChangePasswordDto } from '@modules/users/dtos/change-password.dto';
import { HomeAddressDto } from '@modules/users/dtos/home-address.dto';
import { UpdatePersonalDetailsDto } from '@modules/users/dtos/update-personal-details.dto';
import type {
  IUserProfileService,
  IUserService,
} from '@modules/users/interfaces/user-services.interface';
import { USER_TOKENS } from '@modules/users/user-tokens';
import {
  Body,
  Controller,
  Get,
  Inject,
  Patch,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { IAuthenticatedReqeust } from '@shared/interfaces/request.interface';
import 'multer';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(
    @Inject(USER_TOKENS.SERVICE) private _userService: IUserService,
    @Inject(USER_TOKENS.PROFILE_SERVICE)
    private _userProfileService: IUserProfileService,
  ) {}

  // To fetch the logged in users profile data
  @Get()
  getUserData(@Req() req: IAuthenticatedReqeust) {
    return this._userService.findOne(req.user.id);
  }

  // To edit/save updated user profile data
  @Patch('profile/personals')
  updatePersonalData(
    @Req() req: IAuthenticatedReqeust,
    @Body() dto: UpdatePersonalDetailsDto,
  ) {
    console.log(dto);
    return this._userProfileService.updatePersonalData(req.user.id, dto);
  }

  // To change the password
  @Patch('profile/password')
  changePassword(
    @Req() req: IAuthenticatedReqeust,
    @Body() dto: ChangePasswordDto,
  ) {
    console.log(dto);
    return this._userProfileService.changePassword(req.user.id, dto);
  }

  //To add home address with location
  @Patch('profile/location')
  updateHomeLocation(
    @Req() req: IAuthenticatedReqeust,
    @Body() dto: HomeAddressDto,
  ) {
    return this._userProfileService.updateHomeLocation(req.user.id, dto);
  }

  // chane profile picture
  @Patch('profile/picture')
  @UseInterceptors(FileInterceptor('image'))
  updateProfilePicture(
    @Req() req: IAuthenticatedReqeust,
    @UploadedFile(ImageValidationPipe)
    image: Express.Multer.File,
  ) {
    return this._userProfileService.updateProfilePicture(req.user.id, image);
  }
}
