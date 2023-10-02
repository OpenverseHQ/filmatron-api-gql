import { LessThan, MoreThan, SelectQueryBuilder } from 'typeorm'
import { PageInfo, PaginationArgs } from './interface'
import { ORDER_BY } from '@/common/types'
import { plainToClass } from 'class-transformer'
import { Type } from '@nestjs/common'

/**
 * This function will process query cursor paginate
 *
 * @param query: SelectQueryBuilder of Entity T
 * @param paginationArgs: PaginationArgs
 * @param orderby: ORDER_BY Default is DESC
 * @param cursorColumn: default is id column
 * @param defaultLimit: default is 25
 * @param isUsedPlainClass: boolean this used for process some field will not appears to the FE
 * @param classRef: the reference of the class used inside plainToClass method
 */
export async function paginate<T>(params: {
  query: SelectQueryBuilder<T>
  paginationArgs: PaginationArgs
  orderby?: ORDER_BY
  cursorColumn?: string
  defaultLimit?: number
  isUsedPlainClass?: boolean
  classRef?: Type<T>
}) {
  params.orderby = params.orderby || ORDER_BY.DESC
  params.cursorColumn = params.cursorColumn ?? 'id'
  params.defaultLimit = params.defaultLimit || 25
  const { cursorColumn, defaultLimit, orderby, paginationArgs, query, isUsedPlainClass, classRef } = params
  const { after, before, first, last } = paginationArgs

  query.orderBy({ [cursorColumn]: orderby })

  const totalCountQuery = query.clone()
  let offsetId: number

  // FORWARD pagination
  if (after) {
    offsetId = Number(Buffer.from(after, 'base64').toString('ascii'))
    // console.log(`Paginate AfterID: ${offsetId}`)
    const limit = first ?? defaultLimit
    query.where({ [cursorColumn]: MoreThan(offsetId) }).take(limit)
  }
  // REVERSE pagination
  else if (before) {
    const offsetId = Number(Buffer.from(before, 'base64').toString('ascii'))
    // console.log(`Paginate BeforeID: ${offsetId}`)
    const limit = last ?? defaultLimit
    query.where({ [cursorColumn]: LessThan(offsetId) }).take(limit)
  }

  const result = await query.getMany()
  const startCursorId: number = result.length > 0 ? result[0][cursorColumn] : offsetId
  const endCursorId: number = result.length > 0 ? result.slice(-1)[0][cursorColumn] : offsetId

  const beforeQuery = totalCountQuery.clone()
  const afterQuery = beforeQuery.clone()
  let countBefore = 0
  let countAfter = 0

  if (query.expressionMap.wheres?.length) {
    countBefore = await beforeQuery.andWhere(`${cursorColumn} < :cursor`, { cursor: startCursorId }).getCount()

    countAfter = await afterQuery.andWhere(`${cursorColumn} > :cursor`, { cursor: endCursorId }).getCount()
  } else {
    countBefore = await beforeQuery.where(`${cursorColumn} < :cursor`, { cursor: startCursorId }).getCount()

    countAfter = await afterQuery.where(`${cursorColumn} > :cursor`, { cursor: endCursorId }).getCount()
  }
  // console.log(`CountBefore:${countBefore}`)
  // console.log(`CountAfter:${countAfter}`)

  const edges = result.map(value => {
    if (isUsedPlainClass) {
      value = plainToClass(classRef, value, { excludeExtraneousValues: true })
    }

    return {
      node: value,
      cursor: Buffer.from(`${value[cursorColumn]}`).toString('base64')
    }
  })

  const pageInfo = new PageInfo()
  pageInfo.startCursor = edges.length > 0 ? edges[0].cursor : null
  pageInfo.endCursor = edges.length > 0 ? edges.slice(-1)[0].cursor : null

  pageInfo.hasNextPage = countAfter > 0
  pageInfo.hasPreviousPage = countBefore > 0

  return {
    edges,
    pageInfo
  }
}
