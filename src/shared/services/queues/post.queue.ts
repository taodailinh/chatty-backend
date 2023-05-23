import { IPostJobData } from '@post/interfaces/post.interface';
import { config } from '@root/config';
import { BaseQueue } from '@service/queues/base.queue';
import { postWorker } from '@worker/post.worker';
import Logger from 'bunyan';

const log: Logger = config.createLogger('authLogger');

class PostQueue extends BaseQueue {
  constructor() {
    super('post');
    this.processJob('addPostJob', 5, postWorker.addPostToDB);
  }
  public addPostJob(name: string, data: IPostJobData): void {
    log.info('calling addPostJob');
    this.addJob(name, data);
  }
}

export const postQueue: PostQueue = new PostQueue();
