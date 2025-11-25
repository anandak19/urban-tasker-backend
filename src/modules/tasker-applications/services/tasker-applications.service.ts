import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ITaskerApplicationService } from '../interfaces/tasker-applications-services.interface';
import { IBaseResponse } from '@shared/interfaces/base-response.interface';
import { ICreateTaskerApplication } from '../interfaces/tasker-applications.interface';
import { GENERAL_ERRORS } from '@shared/constants/messages/error-messaes.constants';
import { type IS3Service } from '@core/lib/s3/s3.interface';
import { TASKER_APPLICATION_TOKENS } from '../tasker-applications.token';
import { type ITaskerApplicationRepository } from '../interfaces/tasker-applications-repositories.interface';
import { S3_SERVICE } from '@core/lib/s3/s3.module';
import { TASKER_APPLICATION_SUCCESS_MESSAGES } from '@shared/constants/messages/tasker-application-messages.constants';

@Injectable()
export class TaskerApplicationsService implements ITaskerApplicationService {
  constructor(
    @Inject(S3_SERVICE) private _s3: IS3Service,
    @Inject(TASKER_APPLICATION_TOKENS.REPOSITORY)
    private _taskerApplicationRepo: ITaskerApplicationRepository,
  ) {}

  /**
   * To create tasker application
   * @param taskerApplication
   * @returns
   */
  async create(
    taskerApplication: ICreateTaskerApplication,
  ): Promise<IBaseResponse> {
    const frontImage = taskerApplication.idProof
      .frontImage as Express.Multer.File;
    const backImage = taskerApplication.idProof
      .backImage as Express.Multer.File;

    try {
      const [frontImageKey, backImageKey] = await Promise.all([
        this._s3.uploadIdProofImage(frontImage),
        this._s3.uploadIdProofImage(backImage),
      ]);

      const payload: ICreateTaskerApplication = {
        ...taskerApplication,
        idProof: {
          idProofType: taskerApplication.idProof.idProofType,
          backImage: backImageKey,
          frontImage: frontImageKey,
        },
      };

      await this._taskerApplicationRepo.create(payload);

      return { message: TASKER_APPLICATION_SUCCESS_MESSAGES.CREATE_SUCCESS };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(GENERAL_ERRORS.SERVER_ERROR);
    }
  }
}
