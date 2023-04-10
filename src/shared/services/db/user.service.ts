import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { IUserDocument } from '@user/interfaces/user.interface';
import { UserModel } from '@user/models/user.schema';
import mongoose from 'mongoose';

class UserService {
  public async addUserData(data: IUserDocument): Promise<void> {
    await UserModel.create(data);
  }
  public async getUserById(userId: string): Promise<IUserDocument> {
    const users: IUserDocument[] = await UserModel.aggregate([{$match:{_id: new mongoose.Types.ObjectId(userId)}}, {$lookup:{from: 'Auth', localField:'authId', foreignField: '_id', as: 'authId'}}, {$unwind: 'authId'}, {$project: this.aggregateProject()}]);
    return users[0];
  }

  public async getUserByAuthId(authId: string): Promise<IUserDocument> {
    const users: IUserDocument[] = await UserModel.aggregate([{$match:{authId: new mongoose.Types.ObjectId(authId)}}, {$lookup:{from: 'Auth', localField:'authId', foreignField: '_id', as: 'authId'}}, {$unwind: 'authId'}, {$project: this.aggregateProject()}]);
    return users[0];
  }
}

export const userService: UserService = new UserService();
