import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUserRequest {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
