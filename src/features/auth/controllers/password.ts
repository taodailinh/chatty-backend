import { Request, Response } from 'express';
import { joiValidation } from '@global/decorators/joi-validation.decorators';
import JWT from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { config } from '@root/config';
import { authService } from '@service/db/auth.service';
import { userService } from '@service/db/user.service';
import { BadRequestError } from '@global/helpers/error-handler';
import { loginSchema } from '@auth/schemes/signin';
import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { IResetPasswordParams, IUserDocument } from '@user/interfaces/user.interface';
import { mailTransport } from '@service/mail/mail.transport';
import { emailSchema } from '@auth/schemes/password';
import crypto from 'crypto';
import { forgotPasswordTemplate } from '@service/mail/templates/forgot-password-templates/forgot-password-template';
import { emailQueue } from '@service/queues/emails.queue';
import publicIP from 'ip';
import moment from 'moment';
import { resetPasswordTemplate } from '@service/mail/templates/reset-password/reset-password-template';

export class Password {
  @joiValidation(emailSchema)
  public async create(req: Request, res: Response): Promise<void> {
    const { email } = req.body;
    const existingUser: IAuthDocument = await authService.getAuthUserByEmail(email);
    if (!existingUser) {
      throw new BadRequestError('User not found!');
    }
    const randomByte: Buffer = await Promise.resolve(crypto.randomBytes(20));
    const randomCharacters: string = randomByte.toString('hex');
    await authService.updatePasswordToken(`${existingUser._id}`, randomCharacters, Date.now() * 60 * 60 * 1000);
    const resetLink = `${config.CLIENT_URL}/reset-password?token=${randomCharacters}`;
    const template: string = forgotPasswordTemplate.passwordResetTemplate(existingUser.username, resetLink);
    emailQueue.addEmailJob('forgetPasswordEmail', { template, receiverEmail: email, subject: 'Reset your password' });
    res.status(StatusCodes.OK).json({ message: 'Password reset email sent' });
  }

  @joiValidation(emailSchema)
  public async update(req: Request, res: Response): Promise<void> {
    const { password } = req.body;
    const { token } = req.params;

    const existingUser: IAuthDocument = await authService.getAuthUserByPasswordToken(token);
    if (!existingUser) {
      throw new BadRequestError('Reset token has expired!');
    }

    existingUser.password = password;
    existingUser.passwordResetExpires = undefined;
    existingUser.passwordResetToken = undefined;
    await existingUser.save();

    const templateParams: IResetPasswordParams = {
      username: existingUser.username,
      email: existingUser.email,
      ipaddress: publicIP.address(),
      date: moment().format('DD/MM/YYYY HH:mm')
    };
    const template: string = resetPasswordTemplate.passwordResetConfirmTemplate(templateParams);
    emailQueue.addEmailJob('forgetPasswordEmail', { template, receiverEmail: existingUser.email, subject: 'Password reset confirmation' });
    res.status(StatusCodes.OK).json({ message: 'Password sucessfully changed!' });
  }
}
