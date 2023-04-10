import { Request, Response } from 'express';
import { joiValidation } from '@global/decorators/joi-validation.decorators';
import JWT from 'jsonwebtoken';
import { ReasonPhrases, StatusCodes, getReasonPhrase, getStatusCode } from 'http-status-codes';
import { config } from '@root/config';
import { authService } from '@service/db/auth.service';
import { userService } from '@service/db/user.service';
import { BadRequestError } from '@global/helpers/error-handler';
import { loginSchema } from '@auth/schemes/signin';
import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { IUserDocument } from '@user/interfaces/user.interface';

export class SignIn {
  @joiValidation(loginSchema)
  public async read(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;
    const existingUser: IAuthDocument = await authService.getAuthUserByUserName(username);
    if (!existingUser) {
      throw new BadRequestError('Invalid credential!');
    }
    const passwordMatch: boolean = await existingUser.comparePassword(password);
    if (!passwordMatch) {
      throw new BadRequestError('Invalid credential');
    }

    const user: IUserDocument = await userService.getUserByAuthId(`${existingUser._id}`);

    const userJwt: string = JWT.sign(
      {
        userId: user._id,
        uId: existingUser.uId,
        email: existingUser.email,
        username: existingUser.username,
        avatarColor: existingUser.avatarColor
      },
      config.JWT_TOKEN!
    );
    req.session = { jwt: userJwt };
    
const userDocument: IUserDocument = {...user, username: existingUser!.username, authId: existingUser!._id, email: existingUser!.email, avatarColor: existingUser!.avatarColor, uId: existingUser!.uId, createdAt: existingUser!.createdAt} as IUserDocument;


    res.status(StatusCodes.OK).json({ message: 'Login successfully', user: existingUser, token: userJwt });
  }
}
