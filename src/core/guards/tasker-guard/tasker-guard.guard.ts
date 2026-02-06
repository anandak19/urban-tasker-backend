import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserRoles } from '@shared/constants/enums/user.enum';
import { IAuthenticatedReqeust } from '@shared/interfaces/request.interface';
import { Observable } from 'rxjs';

@Injectable()
export class TaskerGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<IAuthenticatedReqeust>();
    if (request.user.userRole !== UserRoles.TASKER) {
      return false;
    }
    return true;
  }
}
