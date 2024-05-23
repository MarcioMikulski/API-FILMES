import * as bcrypt from 'bcrypt';

export class Encrypt {
  saltOrRounds = 10;
  password;

  encrypt(password: string): string {
    return bcrypt.hashSync(password, this.saltOrRounds);
  }
  compare(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }
}
