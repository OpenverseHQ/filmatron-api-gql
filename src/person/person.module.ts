import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PersonEntity } from 'src/db/entities/person'
import { PersonService } from './person.service'

@Module({
  imports: [TypeOrmModule.forFeature([PersonEntity])],
  providers: [PersonService],
  exports: [PersonService]
})
export class PersonModule {}
