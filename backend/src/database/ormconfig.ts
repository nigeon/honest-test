import { join } from 'path';
import 'reflect-metadata';
import { ConnectionOptions } from 'typeorm';
import config from './../config';

const parentDir = join(__dirname, '..');

const connectionOpts: ConnectionOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || config.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || Number(config.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || config.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || config.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || config.DB_NAME || 'honest',
  entities: [
    `${parentDir}/**/*.entity.ts`,
    `${parentDir}/**/*.entity.js`,
  ],
  synchronize: (process.env.NODE_ENV !== 'production') ? true : false,
  migrationsTableName: 'migrations',
  migrations: ['migrations/*.js'],
  cli: { migrationsDir: 'src/database/migrations' },
  logging: false,
};

export = connectionOpts;
