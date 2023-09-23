import { NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Message, MessageName } from 'src/common/message'
import { PersonEntity } from 'src/db/entities/person'

export class PersonService {
  constructor(
    @InjectRepository(PersonEntity)
    private readonly personRepository: Repository<PersonEntity>
  ) {}

  async findById(id: number, relations?: string[]): Promise<PersonEntity> {
    const person = await this.personRepository.findOne({
      where: { id },
      relations
    })

    if (!person) {
      throw new NotFoundException(Message.Base.NotFound(MessageName.user))
    }

    return person
  }
}
