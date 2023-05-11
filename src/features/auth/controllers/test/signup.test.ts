import { Request, Response } from 'express';
import { authMockRequest, authMockResponse } from '@root/mocks/auth.mock';
import { SignUp } from '@auth/controllers/signup';
import { CustomError } from '@global/helpers/error-handler';
// import { authMock } from '@root/mocks/auth.mock';

jest.mock('@service/queues/base.queue.ts');
jest.mock('@service/queues/auth.queue.ts');
jest.mock('@service/queues/user.queue.ts');
jest.mock('@service/redis/user.cache.ts');
jest.mock('@global/helpers/cloudinary-upload.ts');

describe('SignUp', () => {
  it('Should throw an error if username is not available', () => {
    const req: Request = authMockRequest(
      {},
      {
        username: '',
        email: 'manny@test.com',
        password: 'qwerty',
        avatarColor: 'red',
        avatarImage: 'fasofasolj'
      }
    ) as unknown as Request;
    const res: Response = authMockResponse();
    SignUp.prototype.create(req, res).catch((error: CustomError) => console.log(error));
  });
});
