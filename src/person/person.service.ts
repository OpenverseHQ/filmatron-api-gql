import { NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Message, MessageName } from 'src/common/message'
import { PersonEntity } from 'src/db/entities/person'
import { UpdateInformationDto } from './dtos'
import { ReturnMessageBase } from '@/common/interface/returnBase'

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

  async findByPublicKey(publicKey: string, relations?: string[]): Promise<PersonEntity> {
    const person = await this.personRepository.findOne({
      where: { publicKey },
      relations
    })

    if (!person) {
      throw new NotFoundException(Message.Base.NotFound(MessageName.user))
    }

    return person
  }

  async updateInformation(input: UpdateInformationDto, person: PersonEntity): Promise<ReturnMessageBase> {
    await this.personRepository.update({ id: person.id }, { ...input })

    return {
      success: true,
      message: 'Updated information successfully.'
    }
  }
}
