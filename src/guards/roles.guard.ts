import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { GqlExecutionContext } from '@nestjs/graphql'
import { ROLE } from 'src/common/constant'
import { ROLES_KEY } from 'src/common/decorators/roles.decorator'
import { PersonEntity } from 'src/db/entities/person'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly _reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this._reflector.getAllAndOverride<ROLE>(ROLES_KEY, [context.getHandler(), context.getClass()])

    if (!requiredRoles) {
      return true
    }

    const ctx = GqlExecutionContext.create(context)

    const user = ctx.getContext().req.user as PersonEntity

    if (!user) {
      return false
    }

    return requiredRoles.includes(user.rolePerson.role)
  }
}
