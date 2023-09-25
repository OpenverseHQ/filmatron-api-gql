import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Request } from 'express'
import { PersonService } from 'src/person/person.service'
import { config } from 'src/config'
import { JWTPayload } from 'src/common/types'

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private readonly personService: PersonService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.secrets.refreshToken,
      passReqToCallback: true
    })
  }

  async validate(req: Request, payload: JWTPayload) {
    const refreshToken = req.get('Authorization').replace('Bearer', '').trim()
    const person = await this.personService.findById(parseInt(payload.sub))

    return {
      ...person,
      refreshToken
    }
  }
}
