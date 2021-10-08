import 'source-map-support/register'

import { createLogger } from '../../utils/logger'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { createAttachmentPresignedUrl } from '../../businessLogic/expenses'

import { getUserId } from '../utils';

const logger = createLogger('generate upload url')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const expenseId = event.pathParameters.expenseId
  const userId = getUserId(event)
  if (!expenseId) {
    logger.error('missing expenseId')
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Missing expenseId"
      })
    }
  }

  const attachementUrl = await createAttachmentPresignedUrl(expenseId, userId)

  logger.info('created url: ', {attachementUrl})

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      uploadUrl: attachementUrl
    })

  }
}
