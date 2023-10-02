import { Message, MessageName } from '@/common/message'
import { FilmEntity } from '@/db/entities/film'
import { NotFoundException } from '@nestjs/common'
import { getRepository } from 'typeorm'

export class GetFilmCommand {
  static async getByFilmIdAndPersonId(filmId: number, personId: number, relations?: string[]): Promise<FilmEntity> {
    const film = await getRepository(FilmEntity).findOne({
      where: {
        id: filmId,
        person: {
          id: personId
        }
      },
      relations
    })

    if (!film) {
      throw new NotFoundException(Message.Base.NotFound(MessageName.film))
    }

    return film
  }

  static async getFilmById(id: number, relations?: string[]): Promise<FilmEntity> {
    const film = await getRepository(FilmEntity).findOne({ where: { id }, relations })

    if (!film) {
      throw new NotFoundException(Message.Base.NotFound(MessageName.film))
    }

    return film
  }
}
