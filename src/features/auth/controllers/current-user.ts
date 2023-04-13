import { IUserDocument } from '@user/interfaces/user.interface';
import {Request, Response} from 'express';
import { UserCache } from '@service/redis/user.cache';
import { userService } from '@service/db/user.service';
import { StatusCodes } from 'http-status-codes';

const userCache: UserCache = new UserCache();

export class CurrentUser{
 public async read(req: Request, res: Response): Promise<void> {
    let isUser = false;
    let token = null;
    let user = null;
    const cachedUser: IUserDocument = await userCache.getUserFromCache(`${req.currentUser?.userId}`) as IUserDocument;
    const existingUser: IUserDocument = cachedUser ? cachedUser : await userService.getUserById(`${req.currentUser?.userId}`);
 if(Object.keys(existingUser)) {
   isUser = true;
   token = req.session?.jwt;
   user = existingUser;
 }
 res.status(StatusCodes.OK).json({message: 'successful',token:token,isUser:isUser, user:user});
   }
 
}