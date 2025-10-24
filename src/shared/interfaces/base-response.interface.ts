export interface IBaseResponse {
  message: string;
}

// Use a type alias instead of interface
export type IBasicResponseData<T, K extends string> = IBaseResponse & {
  [key in K]: T;
};

/*
userage:
IBasicResponseData<IBasicUserData, 'userData'>

result:
type:
{
  message: string,
  userData: IBasicUserData
}
*/
