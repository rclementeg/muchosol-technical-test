import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Newspaper } from '../entities/newspaper.entity';
import { CreateNewspaperDto, UpdateNewspaperDto } from '../dtos/newspaper.dto';

@Injectable()
export class NewspapersService {
  constructor(
    @InjectModel(Newspaper.name) private newspaperModel: Model<Newspaper>,
  ) {}

  async findAll() {
    return this.newspaperModel.find().lean();
  }

  async findOne(id: string) {
    return this.newspaperModel.findById(id).lean();
  }

  async create(data: CreateNewspaperDto) {
    const newspaper = await this.newspaperModel.findOne({ url: data.url });

    if (newspaper) {
      return;
    }

    try {
      data.created = data.created || new Date();
      const newNewspaper = new this.newspaperModel(data);
      return newNewspaper.save();
    } catch (error) {
      throw new BadRequestException('Something bad happened', { cause: error });
    }
  }

  async update(id: string, changes: UpdateNewspaperDto) {
    try {
      changes.lastUpdate = changes.lastUpdate || new Date();
      return this.newspaperModel.findByIdAndUpdate(
        id,
        { $set: changes },
        { new: true },
      );
    } catch (error) {
      throw new BadRequestException('Something bad happened', { cause: error });
    }
  }

  async remove(id: string) {
    try {
      return this.newspaperModel.findByIdAndDelete(id);
    } catch (error) {
      throw new BadRequestException('Something bad happened', { cause: error });
    }
  }
}
