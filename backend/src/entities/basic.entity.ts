import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn,
  BeforeUpdate, BeforeInsert, BaseEntity } from 'typeorm';
import { validate, ValidationError as classValidatorError } from 'class-validator';
import { ValidationError } from '../lib/errors';

export abstract class Basic extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  //
  // METHODS
  //

  @BeforeInsert()
  @BeforeUpdate()
  async validateEntity() {
    const errors: classValidatorError[] = await validate(this, { skipMissingProperties: true });
    if (errors.length > 0) {
      console.log(JSON.stringify(errors));
      throw new ValidationError(errors);
    }
  }
}
