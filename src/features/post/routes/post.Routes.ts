import express, { Router } from 'express';
import { CreatePost } from '@post/controllers/create-post';
import { authMiddleware } from '@global/helpers/auth-middleware';
import { Get } from '@post/controllers/get-posts';

class PostRoutes {
  private router: Router;
  constructor() {
    this.router = express.Router();
  }
  public routes(): Router {
    this.router.get('/posts/all/:page',authMiddleware.checkAuthentication,Get.prototype.posts);
    this.router.post('/post', authMiddleware.checkAuthentication, CreatePost.prototype.post);
    this.router.post('/post/image/post', authMiddleware.checkAuthentication, CreatePost.prototype.postWithImage);

    return this.router; // Vi sao phai return? Khong return thi lay gi thang route ben ngoai no dung
  }
}
export const postRoutes: PostRoutes = new PostRoutes();
