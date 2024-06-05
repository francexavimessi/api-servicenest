import { IsString, Length } from 'class-validator';

export class EncryptDataDto {
  @IsString()
  @Length(0, 2000)
  payload: string;
}
