import { JWTKylanPayload } from '@/common/types'
import { PersonService } from '@/person/person.service'
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { JwtService } from '@nestjs/jwt'

//NOTE: minh-30/9/2023: This implement is used for temporary because we do not have the secret key in the third service

@Injectable()
export class KylanGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService, private readonly personService: PersonService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context)
    const token = this.extractTokenFromHeader(ctx)
    // const { pubkey } = this.jwtService.decode(token) as JWTKylanPayload
    /**
     * minh-10/1/2023: because the kylan service can not export private key so in here I fake the publickey decode from the token
     * send from kylan service to find the people I want. When go to product, pls command the below line code and un-command the 
     * above line code
     */
    const pubkey = '89Fh4QKhCEJ5rC1Bf4utchfmqPNejYTfjoW6VxDL8YqB' // FILM MAKER ROLE
    // const pubkey = 'yamRr19VDJAf1ACdyLxLrxJaTRGYdLBNfScKi7whTkQ' // USER ROLE
    const person = await this.personService.findByPublicKey(pubkey, ['rolePerson'])
    ctx.getContext().req.user = person
    return true
  }

  private extractTokenFromHeader(ctx: GqlExecutionContext): string | undefined {
    const request = ctx.getContext().req
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
