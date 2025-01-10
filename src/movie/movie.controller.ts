import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UploadedFile,
  UseInterceptors,
  Req,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../utils/multer';
import { ApiBody, ApiConsumes, ApiCookieAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginateDto } from './dto/movies-pagination.dto';

@ApiTags('Movies')
@ApiCookieAuth()
@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Movies fetch successfully',
    schema: {
      example: {
        data: [
          {
            _id: '641d0a1f1c2b2b06f2a1423b',
            title: 'Inception',
            year: 2010,
            poster: 'https://example.com/uploads/123456789.jpg',
            userId: '641d0a1f1c2b2b06f2a1423a',
            createdAt: '2025-01-09T10:00:00.000Z',
            updatedAt: '2025-01-09T10:00:00.000Z',
          },
        ],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      },
    },
  })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of items per page', type: Number, example: 10 })
  async index(@Req() req, @Query() paginateDto: PaginateDto) {
    return this.movieService.findAll(req.user._id, paginateDto);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'Movie fetch successfully',
    schema: {
      example: {
        _id: '641d0a1f1c2b2b06f2a1423b',
        title: 'Inception',
        year: 2010,
        poster: 'https://example.com/uploads/123456789.jpg',
        userId: '641d0a1f1c2b2b06f2a1423a',
        createdAt: '2025-01-09T10:00:00.000Z',
        updatedAt: '2025-01-09T10:00:00.000Z',
      },
    },
  })
  async show(@Req() req, @Param('id') id: string) {
    return this.movieService.findOne(id, req.user._id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('poster', multerConfig))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create a new movie',
    type: CreateMovieDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Movie created successfully',
    schema: {
      example: {
        _id: '641d0a1f1c2b2b06f2a1423b',
        title: 'Inception',
        year: 2010,
        poster: 'https://example.com/uploads/123456789.jpg',
        userId: '641d0a1f1c2b2b06f2a1423a',
        createdAt: '2025-01-09T10:00:00.000Z',
        updatedAt: '2025-01-09T10:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    schema: {
      example: {
        statusCode: 400,
        error: 'Bad Request',
        message: {
          title: 'title must be a string',
          year: 'year should not be empty',
        },
      },
    },
  })
  async create(
    @Body() createMovieDto: CreateMovieDto,
    @UploadedFile() file,
    @Req() req,
  ) {
    if (!file) {
      return new BadRequestException({
        statusCode: 400,
        error: 'Bad Request',
        message: {
          poster: 'Poster is required',
        },
      });
    }

    const posterUrl = `${process.env.APP_URL}/uploads/${file.filename}`;
    return this.movieService.create(createMovieDto, req.user._id, posterUrl);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('poster', multerConfig))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Create a new movie',
    type: UpdateMovieDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Movie created successfully',
    schema: {
      example: {
        _id: '641d0a1f1c2b2b06f2a1423b',
        title: 'Inception',
        year: 2010,
        poster: 'https://example.com/uploads/123456789.jpg',
        userId: '641d0a1f1c2b2b06f2a1423a',
        createdAt: '2025-01-09T10:00:00.000Z',
        updatedAt: '2025-01-09T10:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    schema: {
      example: {
        statusCode: 400,
        error: 'Bad Request',
        message: {
          title: 'title must be a string',
          year: 'year should not be empty',
        },
      },
    },
  })
  async update(
    @Param('id') id: string,
    @Body() updateMovieDto: UpdateMovieDto,
    @UploadedFile() file,
    @Req() req,
  ) {
    let posterUrl;
    if (file) {
      posterUrl = `${process.env.APP_URL}/uploads/${file.filename}`;
    }
    return this.movieService.update(
      id,
      updateMovieDto,
      req.user._id,
      posterUrl,
    );
  }
}
