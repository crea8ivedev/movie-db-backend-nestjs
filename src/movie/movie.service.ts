import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie } from './movie.schema';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { PaginateDto } from './dto/movies-pagination.dto';

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(Movie.name) private readonly movieModel: Model<Movie>,
  ) {}

  async findAll(userId: string, paginateDto: PaginateDto) {
    const { page, limit } = paginateDto;

    const skip = (page - 1) * limit;
    const movies = await this.movieModel
      .find({ userId })
      .skip(skip)
      .limit(limit)
      .exec();

    const totalMovies = await this.movieModel.countDocuments({ userId }).exec();
    const totalPages = Math.ceil(totalMovies / limit);

    return {
      data: movies,
      meta: {
        total: totalMovies,
        page,
        limit,
        totalPages,
      },
    };
  }

  async findOne(id: string, userId: string) {
    const movie = await this.movieModel.findOne({ _id: id, userId });
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }
    return movie;
  }

  async create(
    createMovieDto: CreateMovieDto,
    userId: string,
    posterUrl: string,
  ) {
    const movie = new this.movieModel({
      ...createMovieDto,
      userId,
      poster: posterUrl,
    });
    return movie.save();
  }

  async update(
    id: string,
    updateMovieDto: UpdateMovieDto,
    userId: string,
    posterUrl?: string,
  ) {
    console.log({ _id: id, userId });
    const movie = await this.movieModel.findOne({ _id: id, userId });
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    Object.assign(movie, updateMovieDto);
    if (posterUrl) {
      movie.poster = posterUrl;
    }

    return movie.save();
  }
}
