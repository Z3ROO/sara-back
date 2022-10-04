import user from '../infra/database/user.json';

export class UserRepo {
  static getUserInfo() {
    return user
  }
}