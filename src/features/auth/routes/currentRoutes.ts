import { CurrentUser } from '@auth/controllers/current-user';
import express, { Router } from 'express';

class CurrentRoutes {
private router:Router;
  constructor() {
    this.router = express.Router();
  }
  public routes(): Router {
    this.router.get('/currentuser', CurrentUser.prototype.read);

    return this.router; // Vi sao phai return?
  }

}
export const currentRoutes: CurrentRoutes = new CurrentRoutes();
