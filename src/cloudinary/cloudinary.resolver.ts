import { BadRequestException, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Args, Field, InputType, Mutation, Resolver } from '@nestjs/graphql';
import { CloudinaryService } from './cloudinary.service';
import { ReturnMessageBase } from '@/common/interface/returnBase';

import { FileInterceptor } from '@nestjs/platform-express';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';
@InputType()
class FileUploadInput {
  @Field(()=> UseInterceptors(FileInterceptor('file')))
  file: Express.Multer.File;
}
@Resolver()
export class CloudinaryResolver {

  constructor(private cloudinary: CloudinaryService) {}
  @Mutation(() => ReturnMessageBase)
  @UseInterceptors(FileInterceptor('file'))
  async uploadImageToCloudinary(@Args('input') input: FileUploadInput) {
    return await this.cloudinary.uploadImage(input.file).catch(() => {
      throw new BadRequestException('Invalid file type.');
    });
  }
}
