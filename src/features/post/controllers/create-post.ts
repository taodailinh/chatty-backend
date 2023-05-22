import { Request, Response } from 'express';
import { joiValidation } from '@global/decorators/joi-validation.decorators';
import { StatusCodes } from 'http-status-codes';
import { IPostDocument } from '@post/interfaces/post.interface';
import { postSchema } from '@post/schemes/post.schemes';
import { ObjectId } from 'mongodb';

export class CreatePost {
  @joiValidation(postSchema)
  public async post(req: Request, res: Response): Promise<void> {
    const { post, bgColor, privacy, gifUrl, profilePicture, feelings } = req.body;
    const postId: ObjectId = new ObjectId();
    const createdPost: IPostDocument = {
      _id: postId,
      userId: req.currentUser?.uId,
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
    res.status(StatusCodes.CREATED).json({ message: 'Post created successfully' });
  }
}
