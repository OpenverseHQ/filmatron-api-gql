import { PersonEntity } from '@/db/entities/person'
import { WhitelistEntity } from '@/db/entities/whitelist'
import { GetFilmCommand } from '@/film/commands/GetFilm.command'
import { Injectable } from '@nestjs/common'
import { GetWhitelistCommand } from './commands/getWhitelist.command'

@Injectable()
export class WhitelistService {
  async getWhitelistOfFilm(filmId: number, person: PersonEntity): Promise<WhitelistEntity[]> {
    const film = await GetFilmCommand.getByFilmIdAndPersonId(filmId, person.id)
    const data = await GetWhitelistCommand.getWhiteListOfFilm(film.id, ['person'])

    return data
  }
}
