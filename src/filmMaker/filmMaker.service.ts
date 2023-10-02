import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PersonEntity } from 'src/db/entities/person'
import { GetFilmMakerCommand } from './commands/getFilmMaker.commands'

@Injectable()
export class FilmMakerService {
  constructor(
    @InjectRepository(PersonEntity)
    private personRepository: Repository<PersonEntity>
  ) {}

  async getById(id: number): Promise<PersonEntity> {
    return await GetFilmMakerCommand.getById(id)
  }
}
