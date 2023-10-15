import { Message, MessageName } from '@/common/message'
import { FilmCompressedNFTEntity } from '@/db/entities/filmCompressedNFT'
import { NotFoundException } from '@nestjs/common'
import { getRepository } from 'typeorm'

export class GetFilmCompressedNFTCommand {
  static async getById(id: number, relations?: string[]): Promise<FilmCompressedNFTEntity> {
    const filmCompressedNFT = await getRepository(FilmCompressedNFTEntity).findOne({
      where: { id },
      relations
    })

    if (!filmCompressedNFT) {
      throw new NotFoundException(Message.Base.NotFound(MessageName.cNFT))
    }

    return filmCompressedNFT
  }

  static async getByName(name: string, relations?: string[]): Promise<FilmCompressedNFTEntity> {
    const filmCompressedNFT = await getRepository(FilmCompressedNFTEntity).findOne({
      where: { name },
      relations
    })

    if (!filmCompressedNFT) {
      throw new NotFoundException(Message.Base.NotFound(MessageName.cNFT))
    }

    return filmCompressedNFT
  }
}
