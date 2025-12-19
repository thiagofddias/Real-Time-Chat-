import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  text!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  room!: string;
}
