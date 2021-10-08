import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { updateExpense } from '../../businessLogic/expenses'
import { UpdateExpenseRequest } from '../../requests/UpdateExpenseRequest'
import { getUserId } from '../utils'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const expenseId = event.pathParameters.expenseId
  const updatedExpense: UpdateExpenseRequest = JSON.parse(event.body)

  if (!expenseId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing expenseId' })
    }
  }

  const userId = getUserId(event)
  await updateExpense(updatedExpense, expenseId, userId)

  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({})
  }
}
