import { Message, MessageName } from '@/common/message'
import { FilmGalleryEntity } from '@/db/entities/filmGalery'
import { NotFoundException } from '@nestjs/common'
import { getRepository } from 'typeorm'

export class GetFilmGalleryCommand {
  static async getById(id: number): Promise<FilmGalleryEntity> {
    const gallery = await getRepository(FilmGalleryEntity).findOne({ where: { id } })

    if (!gallery) {
      throw new NotFoundException(Message.Base.NotFound(MessageName.gallery))
    }

    return gallery
  }
}
