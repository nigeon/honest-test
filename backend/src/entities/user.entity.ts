import config from './../config';

import { Basic } from './basic.entity';
import { Entity, Column, getManager, Repository, BeforeInsert } from 'typeorm';
import { IsEmail, IsDefined } from 'class-validator';
import { Exclude } from 'class-transformer';
import { IsEmailAlreadyExist } from '../lib/validation/IsEmailAlreadyExist';
import * as bcrypt from 'bcrypt';
import * as jsonwebtoken from 'jsonwebtoken';

@Entity()
export class User extends Basic {
  @BeforeInsert()
  async doHashPassword() {
    this.password = await User.hashPassword(this.password);
  }

  @Column({ unique: true, length: 100 })
  @IsEmail()
  @IsEmailAlreadyExist({ //ALERT! This is not an atomic validation! A business logic validation layer (with atomicity) should be added!
    message: 'User $value already exists. Please, choose another email.',
  })
  @IsDefined()
  email: string;

  @Column({ select: false })
  @Exclude()
  password: string;


  //
  // METHODS
  //
  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  static async signup(data: any): Promise<User> {
    const userRepository: Repository<User> = getManager().getRepository(User);
    const user: User = new User();
    userRepository.merge(user, data);

    return userRepository.save(user);
  }

  static getLoginToken(user: User): string {
    const data = {
      id: user.id,
    };

    return jsonwebtoken.sign(data, config.JWT_SECRET);
  }
}