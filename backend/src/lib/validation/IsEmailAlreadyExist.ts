import {registerDecorator, ValidationOptions, ValidatorConstraint,
ValidatorConstraintInterface, ValidationArguments} from 'class-validator';
import { getManager, Repository, SelectQueryBuilder } from 'typeorm';

import { User } from '../../entities/user.entity';

@ValidatorConstraint({ async: true })
export class IsEmailAlreadyExistConstraint implements ValidatorConstraintInterface {

  validate(email: string, args: ValidationArguments) {
    const userRepository: Repository<User> = getManager().getRepository(User);
    const u = userRepository.create(args.object);

    const temp: SelectQueryBuilder<User> = userRepository
      .createQueryBuilder('user')
      .where('email = :email', { email });

    if (u.id) {
      temp.andWhere('id <> :id', { id: u.id });
    }

    return temp.getOne().then((user: User) => {
      if (user) return false;
      return true;
    });
  }

}

export function IsEmailAlreadyExist(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      propertyName,
      target: object.constructor,
      options: validationOptions,
      constraints: [],
      validator: IsEmailAlreadyExistConstraint,
    });
  };
}
