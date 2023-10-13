import { BadRequestException } from '@nestjs/common';
import { Mutation, Resolver } from '@nestjs/graphql';
import { CloudinaryService } from './cloudinary.service';
import { ReturnMessageBase } from '@/common/interface/returnBase';

@Resolver()
export class CloudinaryResolver {
  constructor(private cloudinary: CloudinaryService) {}
  @Mutation(() => ReturnMessageBase, {})
  async uploadImageToCloudinary(file: Express.Multer.File) {
    return await this.cloudinary.uploadImage(file).catch(() => {
      throw new BadRequestException('Invalid file type.');
    });
  }
}
