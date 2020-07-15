import 'reflect-metadata';
import { Connection, createConnection } from 'typeorm';

import connectionOpts = require('./ormconfig');

const connection: Promise<Connection> = createConnection(connectionOpts);

export default connection;
