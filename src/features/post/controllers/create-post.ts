import { Request, Response } from 'express';
import { joiValidation } from '@global/decorators/joi-validation.decorators';
import { StatusCodes } from 'http-status-codes';
import { IPostDocument } from '@post/interfaces/post.interface';
import { postSchema, postWithImageSchema } from '@post/schemes/post.schemes';
import { ObjectId } from 'mongodb';
import { PostCache } from '@service/redis/post.cache';
import { socketIOPostObject } from '@socket/post';
import { postQueue } from '@service/queues/post.queue';
import { UploadApiResponse } from 'cloudinary';
import { uploads } from '@global/helpers/cloudinary-upload';
import { BadRequestError } from '@global/helpers/error-handler';

const postCache: PostCache = new PostCache();

export class CreatePost {
  @joiValidation(postSchema)
  public async post(req: Request, res: Response): Promise<void> {
    const { post, bgColor, privacy, gifUrl, profilePicture, feelings } = req.body;
    // Create the id for the post
    const postId: ObjectId = new ObjectId();

    // Create the post
    const createdPost: IPostDocument = {
      _id: postId,
      userId: req.currentUser?.userId,
      username: req.currentUser?.username,
      email: req.currentUser?.email,
      avatarColor: req.currentUser?.avatarColor,
      profilePicture,
      post,
      bgColor,
      feelings,
      privacy,
      commentsCount: 0,
      imgVersion: '',
      imgId: '',
      gifUrl,
      reactions: { like: 0, happy: 0, wow: 0, sad: 0, love: 0, angry: 0 }
    } as IPostDocument;

    // send the event to the user so that the user can se the post even it has not been added to db
    socketIOPostObject.emit('add post', createdPost);

    // Save the post to cache
    await postCache.savePostToCache({
      key: postId,
      currentUserId: `${req.currentUser?.userId}`,
      uId: `${req.currentUser?.uId}`,
      createdPost
    });

    postQueue.addPostJob('addPostJob', { key: req.currentUser?.uId, value: createdPost });
    res.status(StatusCodes.CREATED).json({ message: 'Post created successfully' });
  }

  @joiValidation(postWithImageSchema)
  public async postWithImage(req: Request, res: Response): Promise<void> {
    const { post, bgColor, privacy, gifUrl, profilePicture, feelings, image } = req.body;
    // Create the id for the post
    const postId: ObjectId = new ObjectId();

    //upload image to cloudinary
    const result: UploadApiResponse = (await uploads(image)) as UploadApiResponse;
    if (!result.public_id) {
      throw new BadRequestError(result.message);
    }

    // Create the post
    const createdPost: IPostDocument = {
      _id: postId,
      userId: req.currentUser?.userId,
      username: req.currentUser?.username,
      email: req.currentUser?.email,
      avatarColor: req.currentUser?.avatarColor,
      profilePicture,
      post,
      bgColor,
      feelings,
      privacy,
      commentsCount: 0,
      imgVersion: result.version.toString(),
      imgId: result.public_id,
      gifUrl,
      reactions: { like: 0, happy: 0, wow: 0, sad: 0, love: 0, angry: 0 }
    } as IPostDocument;

    // send the event to the user so that the user can se the post even it has not been added to db
    socketIOPostObject.emit('add post', createdPost);

    // Save the post to cache
    await postCache.savePostToCache({
      key: postId,
      currentUserId: `${req.currentUser?.userId}`,
      uId: `${req.currentUser?.uId}`,
      createdPost
    });

    postQueue.addPostJob('addPostJob', { key: req.currentUser?.uId, value: createdPost });

    // Call image queue to add image to mongo database

    res.status(StatusCodes.CREATED).json({ message: 'Post created successfully' });
  }
}
