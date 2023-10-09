import { registerEnumType } from '@nestjs/graphql'
import { FILM_GENRE, ADMIN_PROCESS_STATUS, ROLE, FILM_STATUS, GALLERY_TYPE } from '../../common/constant'

registerEnumType(ROLE, { name: 'Role' })
registerEnumType(FILM_GENRE, { name: 'FilmGenre' })
registerEnumType(ADMIN_PROCESS_STATUS, { name: 'AdminProcessStatus' })
registerEnumType(FILM_STATUS, { name: 'FilmStatus' })
registerEnumType(GALLERY_TYPE, { name: 'GalleryType' })
