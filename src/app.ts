import express, { Express } from 'express';
import { ChattyServer } from './setupServer';
import databaseConnection from './setupDatabase';
import { config } from './config';
import Logger from 'bunyan';

const log:Logger = config.createLogger('app.tss');

class Application {
  public initialize(): void {
    log.info('app initialize');
    this.loadConfig();
    databaseConnection();
    const app: Express = express();
    const server: ChattyServer = new ChattyServer(app);
    server.start();
  }
  private loadConfig(): void {
    config.validateConfig();
    config.configCloudinary();
  }
}

const application: Application = new Application();
application.initialize();
