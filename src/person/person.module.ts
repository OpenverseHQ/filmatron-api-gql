import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PersonEntity } from 'src/db/entities/person'
import { PersonService } from './person.service'
import { PersonResolver } from './person.resolver'

@Module({
  imports: [TypeOrmModule.forFeature([PersonEntity])],
  providers: [PersonService, PersonResolver],
  exports: [PersonService]
})
export class PersonModule {}
