export class InternalServerError extends Error {
  status: number;
  constructor(message: string = '') {
    super(`Internal Server Error: ${message}`);

    this.name = 'Internal Server Error'
    this.status = 500;
  }
}

export class BadRequest extends Error {
  status: number;
  constructor(message: string = '') {
    super(`Bad Request: ${message}`);

    this.name = 'Bad Request'
    this.status = 400;
  }
}