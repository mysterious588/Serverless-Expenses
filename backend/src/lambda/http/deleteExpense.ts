import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { deleteExpense } from '../../businessLogic/expenses'
import { getUserId } from '../utils'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const expenseId = event.pathParameters.expenseId
    if (!expenseId){
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'expenseId missing'
        })
      }
    }
    
    const userId = getUserId(event)
    await deleteExpense(expenseId, userId)
    
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({})
    }
  }