import { Module } from '@nestjs/common';
import { CloudinaryProvider } from './cloudinary';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryResolver } from './cloudinary.resolver';

@Module({
  providers: [CloudinaryProvider, CloudinaryService, CloudinaryResolver],
  exports: [CloudinaryProvider, CloudinaryService, CloudinaryResolver],
})
export class CloudinaryModule {}
