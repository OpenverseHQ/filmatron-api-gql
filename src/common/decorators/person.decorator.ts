import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

export const Person = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const gqlCtx = GqlExecutionContext.create(ctx)
  //@ts-ignore
  const person = gqlCtx.args[2].req.user

  return data ? person?.[data] : person
})
