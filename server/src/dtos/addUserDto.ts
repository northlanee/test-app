import { ArrayMaxSize, ArrayMinSize, IsArray, IsString } from 'class-validator';

export class AddUserDto {
  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(2)
  @IsString({ each: true })
  emails: string[];
}
