import { UseGuards, applyDecorators } from '@nestjs/common'
import { AccessTokenGuard } from 'src/guards/accessToken.guard'
import { RolesGuard } from 'src/guards/roles.guard'
import { Roles } from './roles.decorator'

export function Auth(scopes?: string[]) {
  if (scopes?.length > 0) {
    return applyDecorators(Roles(...scopes), UseGuards(AccessTokenGuard, RolesGuard))
  }

  return applyDecorators(UseGuards(AccessTokenGuard))
}
