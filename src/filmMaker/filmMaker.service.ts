import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PersonEntity } from 'src/db/entities/person'

@Injectable()
export class FilmMakerService {
  constructor(
    @InjectRepository(PersonEntity)
    private personRepository: Repository<PersonEntity>
  ) {}

  async findOne(id: number): Promise<PersonEntity> {
    return await this.personRepository.findOneOrFail({ where: { id } })
  }
}
