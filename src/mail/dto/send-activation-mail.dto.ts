import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class SendActivationMailBody {
  @ApiProperty({
    example: 'test@gmail.com',
    description: 'Электронная почта',
  })
  @IsString({ message: 'Поле to должно быть строкой' })
  @IsEmail({}, { message: 'Некорректный email' })
  readonly to: string;
  @ApiProperty({
    example: 'http://localhost:8000',
    description: 'Ссылка подтверждения электронной почты',
  })
  @IsString({ message: 'Поле link должно быть строкой' })
  readonly link: string;
}
