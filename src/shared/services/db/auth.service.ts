import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { AuthModel } from '@auth/models/auth.schema';
import { Helpers } from '@global/helpers/helper';

class AuthService {
  public async creatAuthUser(data: IAuthDocument): Promise<void> {
    await AuthModel.create(data);
  }

  public async updatePasswordToken(authId: string, token: string, tokenExpiration: number) {
    await AuthModel.updateOne({ _id: authId }, { passwordResetToken: token, passwordResetExpires: tokenExpiration });
  }

  public async getUserByUserNameOrEmail(username: string, email: string): Promise<IAuthDocument> {
    const query = {
      $or: [{ username: Helpers.firstLetterUppercase(username) }, { email: Helpers.lowerCase(email) }]
    };
    const user: IAuthDocument = (await AuthModel.findOne(query).exec()) as IAuthDocument;
    return user;
  }

  public async getAuthUserByUserName(username: string): Promise<IAuthDocument> {
    const user: IAuthDocument = (await AuthModel.findOne({ username: Helpers.firstLetterUppercase(username) }).exec()) as IAuthDocument;
    return user;
  }

  public async getAuthUserByEmail(email: string): Promise<IAuthDocument> {
    const user: IAuthDocument = (await AuthModel.findOne({ email: Helpers.lowerCase(email) }).exec()) as IAuthDocument;
    return user;
  }

  public async getAuthUserByPasswordToken(token: string): Promise<IAuthDocument> {
    const user: IAuthDocument = (await AuthModel.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    }).exec()) as IAuthDocument;
    return user;
  }
}

export const authService: AuthService = new AuthService();
