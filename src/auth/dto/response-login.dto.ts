import { ResponseUserDto } from 'src/users/dto/response-user.dto';

export interface ResponseLoginDTO {
  user: ResponseUserDto;

  acessToken: string;
}
