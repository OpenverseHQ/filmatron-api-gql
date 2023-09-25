import { GraphQLScalarType } from 'graphql'

export const TimeDateScalar = new GraphQLScalarType({
  name: 'TimeDate',
  description: 'Accept value as Int or UTC timestamp in string format',
  parseValue(value: any) {
    if (typeof value === 'bigint') {
      return value
    }
    return new Date(value).getTime()
  },
  serialize(value) {
    if (typeof value === 'string') {
      return new Date(value).getTime()
    }
    return value
  }
})

export const DateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Accept value as time stamp with timezone in string format',
  parseValue(value: any) {
    return value
  },
  serialize(value) {
    if (typeof value === 'string') {
      return new Date(value)
    }
    return value
  }
})
