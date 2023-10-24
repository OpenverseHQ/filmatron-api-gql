import { BadRequestException, Injectable, ForbiddenException, UnauthorizedException } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { CreateAccountDto, ReturnAccountDto, ReturnSolanaAddressDto, ReturnTokenDto, SignInDto, SignInWithSocialDto } from './dtos/auth.dto'
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

  async signIn({ email, password }: SignInDto): Promise<ReturnAccountDto> {
    const person = await this.personRepository.findOne({ where: { email } })

    if (!person) {
      throw new BadRequestException(Message.Base.NotFound(MessageName.user))
    }

    const passwordMatches = person.comparePassword(password)
    if (!passwordMatches) {
      throw new BadRequestException(Message.Base.NotFound(MessageName.user))
    }

    const tokens = await this.getTokens(person.id, person.email)
    await this.updateRefreshToken(person.id, tokens.refreshToken)

    delete person.password

    return {
      ...tokens,
      person
    }
  }

  async signInWithSocial({ publicKey, role }: SignInWithSocialDto, authorization: string): Promise<ReturnAccountDto> {
    const idToken = authorization.replace('Bearer ', '')

    try {
         const { address } = await this.getSolanaAddress(authorization)
      
        const person = await this.personRepository.findOne({ where: { publicKey: address} })
        if (!person) {

          const url = 'https://filmatron-client-a88cb9.kylan.so/api/user'
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Access-Control-Allow-Origin': '*',
              Authorization: authorization,
            },
          });
    
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          
          const data = await response.json();
          const rolePerson = await this.roleRepository.findOne({ where: { role } });

          await this.personRepository.save({
            publicKey: address,
            email: data.email,
            avatar: data.image,
            name: data.name,
            rolePerson,
          });
    
         
      }
      return {
        accessToken: idToken,
        person,
        refreshToken: 'testRefresh',
      };
    } catch (error) {
      console.log(error);
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
          expiresIn: '30m'
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

  async getSolanaAddress(authorization: string): Promise<ReturnSolanaAddressDto> {
    console.log(authorization);
    
    if (!authorization) {
      return { address: '' };
    }
  
    try {
      const url = 'https://filmatron-client-a88cb9.kylan.so/api/user/address/solana';
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: authorization,
        },
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      return {
        address: data.address,
      };
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException(Message.Base.NotFound('Token invalid'));
    }
  }
  

  hashData(data: string) {
    return bcrypt.hashSync(data, config.bcrypt.salt)
  }
}
