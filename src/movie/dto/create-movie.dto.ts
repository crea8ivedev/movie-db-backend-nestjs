import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Min, Max, IsOptional } from 'class-validator';

export class CreateMovieDto {
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
