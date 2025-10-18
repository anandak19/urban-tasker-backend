import { IsEmailUnique } from '@core/validators/is-email-unique.validator';
import { registerDecorator, ValidationOptions } from 'class-validator';

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
