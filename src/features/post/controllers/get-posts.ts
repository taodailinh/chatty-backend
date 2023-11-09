import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { IPostDocument } from '@post/interfaces/post.interface';
import { PostCache } from '@service/redis/post.cache';
import { postService } from '@service/db/post.service';
import { config } from '@root/config';

const logger = config.createLogger('getpost');
const postCache: PostCache = new PostCache();
const PAGE_SIZE = 25;

export class Get {
  public async posts(req: Request, res: Response): Promise<void> {
    logger.info('getting posts');
    const { page } = req.params;
    const skip: number = (parseInt(page) - 1) * PAGE_SIZE;
    const limit: number = PAGE_SIZE;
    const newSkip: number = skip === 0 ? skip : skip + 1;
    let posts: IPostDocument[] = [];
    let totalPosts = 0;
    const cachedPosts: IPostDocument[] = await postCache.getPostsFromCache('post', newSkip, newSkip + limit);
    posts = cachedPosts.length > 0 ? cachedPosts : await postService.getPosts({}, skip, limit, { createdAt: -1 });
    totalPosts = cachedPosts.length > 0 ? await postCache.getTotalPostsInCache() : await postService.postsCount();
    res.status(StatusCodes.OK).json({ message: 'Successful get posts', posts: posts, totalPosts: totalPosts });
    logger.info('done getting posts');
  }
}
