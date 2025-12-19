import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class JoinDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(32)
  room!: string;
}
