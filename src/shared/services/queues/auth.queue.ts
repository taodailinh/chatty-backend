import { IAuthJob } from '@auth/interfaces/auth.interface';
import { config } from '@root/config';
import { BaseQueue } from '@service/queues/base.queue';
import { authWorker } from '@worker/auth.worker';
import Logger from 'bunyan';

const log: Logger = config.createLogger('authLogger');

class AuthQueue extends BaseQueue {
  constructor() {
    super('auth');
    this.processJob('addAuthUserJob', 5, authWorker.addAuthUserToDB);
  }
  public addAuthUserJob(name: string, data: IAuthJob): void {
    log.info('calling addAuthUserJob');
    this.addJob(name, data);
  }
}

export const authQueue: AuthQueue = new AuthQueue();
