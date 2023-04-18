import mongoose from 'mongoose';
import { config } from '@root/config';
import Logger from 'bunyan';
import { redisConnection } from '@service/redis/redis.connection';

const log: Logger = config.createLogger('setupDatabase');

export default () => {
  const connect = () => {
    log.info(`${config.DATABASE_URL}`)
    mongoose
      .connect(`${config.DATABASE_URL}`)
      .then(() => {
        log.info('Database connected');
        redisConnection.connect();
      })
      .catch((error) => {
        log.error('Error connecting to database');
        return process.exit(1);
      });
  };
  connect();
  mongoose.connection.on('disconnected', connect);
};
