import { ComplaintStatus } from '@shared/constants/enums/complaint-status.enum';
import { Types } from 'mongoose';

export interface ICreateComplaint {
  taskId: Types.ObjectId;
  taskerId: Types.ObjectId;
  createdBy: Types.ObjectId;
  text: string;
  imageKeys: string[];
}

export interface IListComplaintRepoResult
  extends Pick<ICreateComplaint, 'text'> {
  createdBy: string; // name of user

  _id: Types.ObjectId;
  cmpId: string;

  /**
   * tsk id after joinging with task collection (optionl now)
   */
  tskId?: string;

  text: string;
  createdAt: Date;
  complaintStatus: ComplaintStatus;
}
