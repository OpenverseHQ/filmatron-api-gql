import { registerEnumType } from '@nestjs/graphql'
import { FILM_GENRE, FILM_STATUS, ROLE } from '../../common/constant'

registerEnumType(ROLE, { name: 'Role' })
registerEnumType(FILM_GENRE, { name: 'FilmGenre' })
registerEnumType(FILM_STATUS, { name: 'FilmStatus' })
