import { ROLE } from '@/common/constant'
import { Message, MessageName } from '@/common/message'
import { PersonEntity } from '@/db/entities/person'
import { NotFoundException } from '@nestjs/common'
import { getRepository } from 'typeorm'

export class GetFilmMakerCommand {
  static async getById(id: number): Promise<PersonEntity> {
    const filmMaker = await getRepository(PersonEntity)
      .createQueryBuilder()
      .leftJoin('PersonEntity.rolePerson', 'rolePerson')
      .where('PersonEntity.id = :id', { id })
      .andWhere('rolePerson.role = :role', { role: ROLE.FILMMAKER })
      .getOne()

    if (!filmMaker) {
      throw new NotFoundException(Message.Base.NotFound(MessageName.filmMaker))
    }

    return filmMaker
  }
}
