import { Request, Response } from 'express';
import { joiValidation } from '@global/decorators/joi-validation.decorators';
import { StatusCodes } from 'http-status-codes';
import { config } from '@root/config';
import { authService } from '@service/db/auth.service';
import { BadRequestError } from '@global/helpers/error-handler';
import { IAuthDocument } from '@auth/interfaces/auth.interface';
import { IResetPasswordParams } from '@user/interfaces/user.interface';
import { emailSchema, passwordSchema } from '@auth/schemes/password';
import crypto from 'crypto';
import { forgotPasswordTemplate } from '@service/mail/templates/forgot-password-templates/forgot-password-template';
import { emailQueue } from '@service/queues/emails.queue';
import publicIP from 'ip';
import moment from 'moment';
import { resetPasswordTemplate } from '@service/mail/templates/reset-password/reset-password-template';

export class Password {
  // Method to create a reset token to the auth document and send the email containing the link to reset password
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
    res.status(StatusCodes.OK).json({ message: 'Password reset email sent.' });
  }

  @joiValidation(passwordSchema)
  public async update(req: Request, res: Response): Promise<void> {
    const { password } = req.body;
    const { token } = req.params;

    const existingUser: IAuthDocument = await authService.getAuthUserByPasswordToken(token);

    if (!existingUser) {
      throw new BadRequestError('Reset token has expired.');
    }

    // Set the new password to database and clear password reset token
    existingUser.password = password;
    existingUser.passwordResetExpires = undefined;
    existingUser.passwordResetToken = undefined;
    await existingUser.save();

    // Create template params for the email
    const templateParams: IResetPasswordParams = {
      username: existingUser.username,
      email: existingUser.email,
      ipaddress: publicIP.address(),
      date: moment().format('DD/MM/YYYY HH:mm')
    };

    // Create the template
    const template: string = resetPasswordTemplate.passwordResetConfirmTemplate(templateParams);
    emailQueue.addEmailJob('forgetPasswordEmail', { template, receiverEmail: existingUser.email, subject: 'Password reset confirmation' });
    res.status(StatusCodes.OK).json({ message: 'Password successfully updated.' });
  }
}
