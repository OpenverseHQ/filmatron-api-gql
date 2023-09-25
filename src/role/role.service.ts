import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { RoleEntity } from 'src/db/entities/role'
import { Repository } from 'typeorm'

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>
  ) {}
}
