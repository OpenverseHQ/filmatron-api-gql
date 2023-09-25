import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RoleEntity } from 'src/db/entities/role'
import { RoleService } from './role.service'

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity])],
  providers: [RoleService]
})
export class RoleModule {}
