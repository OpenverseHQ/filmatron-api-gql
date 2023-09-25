import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PersonService } from 'src/person/person.service'
import { config } from 'src/config'
import { JWTPayload } from 'src/common/types'

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly personService: PersonService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.secrets.accessToken
    })
  }

  async validate(payload: JWTPayload) {
    console.log(payload)
    return await this.personService.findById(parseInt(payload.sub), ['rolePerson'])
  }
}
