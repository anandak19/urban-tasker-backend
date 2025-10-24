import { IsEmailExists } from '@core/validators/is-email-exist.validator';
import { IsEmailUnique } from '@core/validators/is-email-unique.validator';
import { registerDecorator, ValidationOptions } from 'class-validator';

/*
    Checks if the requested email is not exists in db: throw error if exists
*/
export function EmailUnique(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'EmailUnique',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsEmailUnique,
    });
  };
}

/*
    Checks if the requested email is exist in db: trow error if not exists
*/
export function EmailExists(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'EmailExists',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsEmailExists,
    });
  };
}
