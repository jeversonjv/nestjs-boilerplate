import { IsEmail, IsString, Length, MaxLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @MaxLength(60)
  email: string;

  @IsString()
  @Length(8, 60)
  password: string;
}
