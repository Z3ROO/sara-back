import user from '../infra/database/local/user.json';

export class UserRepo {
  static getUserInfo() {
    return user
  }
}