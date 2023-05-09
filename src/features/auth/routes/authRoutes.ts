import { Password } from '@auth/controllers/password';
import { SignIn } from '@auth/controllers/signin';
import { SignOut } from '@auth/controllers/signout';
import { SignUp } from '@auth/controllers/signup';
import express, { Router } from 'express';

class AuthRoutes {
  private router: Router;
  constructor() {
    this.router = express.Router();
  }
  public routes(): Router {
    this.router.post('/signup', SignUp.prototype.create);
    this.router.post('/signin', SignIn.prototype.read);
    this.router.post('/password-reset', Password.prototype.create);
    this.router.post('/reset-password/:token', Password.prototype.update);

    return this.router; // Vi sao phai return?
  }

  // Dupplicate the routes method because the users need to login before logging out (??)
  public signoutRoute(): Router {
    this.router.get('/signout', SignOut.prototype.update);

    return this.router; // Vi sao phai return?
  }
}
export const authRoutes: AuthRoutes = new AuthRoutes();
