import { BadRequestException, Injectable, ForbiddenException, UnauthorizedException } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { CreateAccountDto, ReturnAccountDto, ReturnTokenDto, SignInDto } from './dtos/auth.dto'
import { PersonEntity } from 'src/db/entities/person'
import { Message, MessageName } from 'src/common/message'
import { config } from 'src/config'
import { ReturnMessageBase } from 'src/common/interface/returnBase'
import { RoleEntity } from '@/db/entities/role'
import { TokenPayload } from 'src/common/types'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(PersonEntity)
    private personRepository: Repository<PersonEntity>,
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
    private jwtService: JwtService
  ) {}

  async signUp({ email, name, password, role }: CreateAccountDto): Promise<ReturnAccountDto> {
    const personExist = await this.personRepository.findOne({ where: { email } })

    if (personExist) {
      throw new BadRequestException(Message.Base.Exists(MessageName.user))
    }

    const hashPassword = this.hashData(password)

    const rolePerson = await this.roleRepository.findOne({ where: { role } })
    const personData = this.personRepository.create({
      email,
      name,
      password: hashPassword,
      rolePerson
    })
    const newPerson = await this.personRepository.save(personData)
    const tokens = await this.getTokens(newPerson.id, email)
    const hashRefreshToken = this.hashData(tokens.refreshToken)
    newPerson.refreshToken = hashRefreshToken
    await this.personRepository.update({ id: newPerson.id }, { refreshToken: hashRefreshToken })

    delete newPerson.password

    return {
      ...tokens,
      person: newPerson
    }
  }

  async signIn({ publicKey }: SignInDto, authorization: string): Promise<ReturnAccountDto> {
    const idToken = authorization.replace('Bearer ', '')

    try {
      const decodedToken: TokenPayload = this.jwtService.decode(idToken) as TokenPayload
      if (!decodedToken) {
        throw new ForbiddenException(Message.Base.AccessDenied())
      }

      if (decodedToken?.pubkey) {
        const person = await this.personRepository.findOne({ where: { publicKey: decodedToken.pubkey } })

        if (!person) {
          const url = 'https://filmatron-jwks.kylan.so/api/user'
          fetch(url, {
            method: 'GET',
            headers: {
              'Access-Control-Allow-Origin': '*',
              Authorization: authorization
            }
          })
            .then(response => {
              if (!response.ok) {
                throw new Error('Network response was not ok')
              }
              return response.json()
            })
            .then(async data => {
              await this.personRepository.save({
                publicKey: decodedToken.pubkey,
                email: data.email,
                avatar: data.image,
                name: data.name,
                role: 'USER'
              })
            })
            .catch(() => {
              throw new UnauthorizedException(Message.Base.NotFound('Authorization invalid'))
            })
        }

        return {
          accessToken: idToken,
          person,
          refreshToken: ''
        }
      }
    } catch {
      throw new UnauthorizedException(Message.Base.NotFound('Token invalid'))
    }
  }

  async logOut(personId: number): Promise<ReturnMessageBase> {
    await this.personRepository.update({ id: personId }, { refreshToken: null })

    return {
      success: true,
      message: 'Log out successfully'
    }
  }

  async refreshToken(personId: number, refreshToken: string): Promise<ReturnTokenDto> {
    const person = await this.personRepository.findOne({ where: { id: personId } })

    if (!person?.refreshToken) {
      throw new ForbiddenException(Message.Base.AccessDenied())
    }

    const refreshTokenMatches = bcrypt.compareSync(refreshToken, person.refreshToken)

    if (!refreshTokenMatches) {
      throw new ForbiddenException(Message.Base.AccessDenied())
    }

    const tokens = await this.getTokens(person.id, person.email)

    await this.updateRefreshToken(person.id, tokens.refreshToken)

    return tokens
  }

  async updateRefreshToken(personId: number, refreshToken: string) {
    const hashRefreshToken = this.hashData(refreshToken)

    await this.personRepository.update({ id: personId }, { refreshToken: hashRefreshToken })
  }

  async getTokens(personId: number, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: personId,
          email
        },
        {
          secret: config.secrets.accessToken,
          expiresIn: '15m'
        }
      ),
      this.jwtService.signAsync(
        {
          sub: personId,
          email
        },
        {
          secret: config.secrets.refreshToken,
          expiresIn: '7d'
        }
      )
    ])

    return {
      accessToken,
      refreshToken
    }
  }

  hashData(data: string) {
    return bcrypt.hashSync(data, config.bcrypt.salt)
  }
}
