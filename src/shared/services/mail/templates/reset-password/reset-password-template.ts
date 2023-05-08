import fs from 'fs';
import ejs from 'ejs';
import { IResetPasswordParams } from '@user/interfaces/user.interface';

class ResetPasswordTemplate {
  public passwordResetConfirmTemplate(resetParams: IResetPasswordParams): string {
    const { username, email, ipaddress, date } = resetParams;
    return ejs.render(fs.readFileSync(__dirname + '/reset-password-template.ejs', 'utf8'), {
      username,
      email,
      ipaddress,
      date,
      image_url: 'https://www.simplilearn.com/ice9/free_resources_article_thumb/what_is_image_Processing.jpg'
    });
  }
}

export const resetPasswordTemplate: ResetPasswordTemplate = new ResetPasswordTemplate();
