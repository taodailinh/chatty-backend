import {StatusCodes} from 'http-status-codes';

export interface IErrorResponse {
  message: string;
  statusCode: number;
  status: string;
  serializeError(): IError;
}

export interface IError {
  message: string;
  statusCode: number;
  status: string;
}

export abstract class CustomError extends Error {
  abstract statusCode: number;
  abstract status: string;
  constructor(message: string) {
    super(message);
  }
  serializeErrors(): IError {
    return {
      message: this.message,
      status: this.status,
      statusCode: this.statusCode
    };
  }
}

export class JoiRequestValidationError extends CustomError {
  statusCode = StatusCodes.BAD_REQUEST;
  status = 'error';
  constructor(message: string) {
    super(message);
  }
}

export class BadRequestError extends CustomError {
  status = 'error';
  statusCode = StatusCodes.BAD_REQUEST;
  constructor(message: string) {
    super(message);
  }
}

export class NotFoundError extends CustomError {
  status = 'error';
  statusCode = StatusCodes.NOT_FOUND;
  constructor(message: string) {
    super(message);
  }
}

export class NotAuthorizedError extends CustomError {
  status = 'error';
  statusCode = StatusCodes.UNAUTHORIZED;
  constructor(message: string) {
    super(message);
  }
}

export class FileTooLargeError extends CustomError {
  status = 'error';
  statusCode = StatusCodes.REQUEST_TOO_LONG;
  constructor(message: string) {
    super(message);
  }
}

export class ServerError extends CustomError {
  status = 'error';
  statusCode = StatusCodes.SERVICE_UNAVAILABLE;
  constructor(message: string) {
    super(message);
  }
}
