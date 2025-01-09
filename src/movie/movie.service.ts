import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie } from './movie.schema';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(Movie.name) private readonly movieModel: Model<Movie>,
  ) {}

  async findAll(userId: string) {
    return await this.movieModel.find({ userId });
  }

  async findOne(id: string, userId: string) {
    const movie = await this.movieModel.findOne({ _id: id, userId });
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }
    return movie;
  }

  async create(createMovieDto: CreateMovieDto, userId: string, posterUrl: string) {
    const movie = new this.movieModel({
      ...createMovieDto,
      userId,
      poster: posterUrl,
    });
    return movie.save();
  }

  async update(id: string, updateMovieDto: UpdateMovieDto, userId: string, posterUrl?: string) {
    console.log({ _id: id, userId })
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
