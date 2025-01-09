import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Email address',
    example: 'abc@example.com',
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    description: 'Password',
    example: '12345678',
  })
  @IsNotEmpty()
  @IsString()
  password: number;

  @ApiProperty({
    description: 'Remember me',
    type: 'boolean',
  })
  @IsOptional()
  @IsBoolean()
  rememberMe: string;
}
