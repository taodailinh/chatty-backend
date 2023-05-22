import { Request, Response } from 'express';
import { authMock, authMockRequest, authMockResponse } from '@root/mocks/auth.mock';
import { SignUp } from '@auth/controllers/signup';
import { CustomError } from '@global/helpers/error-handler';
import { authService } from '@service/db/auth.service';
import { UserCache } from '@service/redis/user.cache';
import * as uploads from '@global/helpers/cloudinary-upload';
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
        username: 'tao',
        email: 'manny@test.com',
        password: 'qwerty',
        avatarColor: 'red',
        avatarImage: 'fasofasolj'
      }
    ) as unknown as Request;
    const res: Response = authMockResponse();
    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      return expect(error.statusCode).toEqual(400);
    });
  });

  it('Should throw an error if the email is not valid', () => {
    const req: Request = authMockRequest(
      {},
      {
        username: 'randomusername',
        email: 'manny',
        password: 'qwerty',
        avatarColor: 'red',
        avatarImage: 'fasofasolj'
      }
    ) as unknown as Request;
    const res: Response = authMockResponse();
    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      return expect(error.serializeErrors().message).toEqual('Invalid username');
    });
  });

  it('Should throw an error if the user already exists =', () => {
    const req: Request = authMockRequest(
      {},
      {
        username: 'Manny',
        email: 'manny@gmail.com',
        password: 'qwerty',
        avatarColor: 'red',
        avatarImage: 'fasofasolj'
      }
    ) as unknown as Request;
    const res: Response = authMockResponse();
    jest.spyOn(authService, 'getAuthUserByUserName').mockResolvedValue(authMock);
    SignUp.prototype.create(req, res).catch((error: CustomError) => {
      return expect(error.serializeErrors().message).toEqual('ssdsdgssgsgf');
    });
  });

  // it('Should set session data and send correct json response', async () => {
  //   const req: Request = authMockRequest(
  //     {},
  //     {
  //       username: 'Manny',
  //       email: 'manny@gmail.com',
  //       password: 'qwerty',
  //       avatarColor: 'red',
  //       avatarImage: 'fasofasolj'
  //     }
  //   ) as unknown as Request;
  //   const res: Response = authMockResponse();
  //   jest.spyOn(authService, 'getAuthUserByUserName').mockResolvedValue(null);
  //   const userSpy = jest.spyOn(UserCache.prototype, 'saveUserToCache');
  //   jest.spyOn(uploads, 'uploads').mockImplementation((): any => Promise.resolve({ version: '1', public_id: 'joqwjgasofj' }));
  //   await SignUp.prototype.create(req, res);
  //   console.log(req);
  //   console.log(res);
  //   expect(req.session?.jwt).toBeDefined();
  // });
});
