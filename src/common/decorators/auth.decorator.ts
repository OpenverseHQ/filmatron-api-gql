import { UseGuards, applyDecorators } from '@nestjs/common'
import { AccessTokenGuard } from 'src/guards/accessToken.guard'
import { RolesGuard } from 'src/guards/roles.guard'
import { Roles } from './roles.decorator'
import { KylanGuard } from '@/guards/kylanToken.guard'

export function Auth(scopes?: string[]) {
  if (scopes?.length > 0) {
    return applyDecorators(Roles(...scopes), UseGuards(AccessTokenGuard, RolesGuard))
  }

  return applyDecorators(UseGuards(AccessTokenGuard))
}

export function AuthKylan(scopes?: string[]) {
  if (scopes?.length > 0) {
    return applyDecorators(Roles(...scopes), UseGuards(KylanGuard, RolesGuard))
  }

  return applyDecorators(UseGuards(KylanGuard))
}
