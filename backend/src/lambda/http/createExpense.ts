import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import 'source-map-support/register'

import { CreateExpenseRequest } from '../../requests/CreateExpenseRequest'
import { getUserId } from '../utils';
import { createExpense } from '../../businessLogic/expenses'

  export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newExpense: CreateExpenseRequest = JSON.parse(event.body)
    
    const userId = getUserId(event)
    const expenseItem = await createExpense(newExpense, userId)

    return {
    	statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
    	body: JSON.stringify({
    		item: expenseItem })
    }
  }
