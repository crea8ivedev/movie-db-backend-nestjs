import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class UpdateMovieDto {
  @ApiProperty({
    description: 'Title of the movie',
    example: 'Inception',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Release year of the movie',
    example: '2010',
  })
  @IsNotEmpty()
  year: number;
  @ApiProperty({
    description: 'Poster image file (max 2MB)',
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  @IsString()
  poster: string;
}
