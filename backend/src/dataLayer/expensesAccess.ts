import * as AWS from 'aws-sdk'
//import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { ExpenseItem } from '../models/ExpenseItem'
import { ExpenseUpdate } from '../models/ExpenseUpdate';

//const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('Expenses Access')

export class ExpensesAccess {
    constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly expensesTable = process.env.EXPENSES_TABLE
    ) { }


    async getExpenses(userId: string): Promise<ExpenseItem[]> {
        const result = await this.docClient.query({
            TableName: this.expensesTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()

        logger.info('returned all expenses: ', result.Items as ExpenseItem[])

        return result.Items as ExpenseItem[]
    }

    async createExpense(expenseItem: ExpenseItem): Promise<ExpenseItem> {
        await this.docClient.put({
            TableName: this.expensesTable,
            Item: expenseItem
        }).promise()

        logger.info('new expense created: ', { expenseItem })

        return expenseItem
    }

    async deleteExpense(expenseId: string, userId: string) {
        await this.docClient.delete({
            TableName: this.expensesTable,
            Key: {
                expenseId,
                userId
            },
            ReturnValues: 'ALL_OLD'
        }).promise()

        logger.info('delete expense with id: ', { expenseId })
    }

    async updateExpense(expenseId: string, userId: string, expenseUpdate: ExpenseUpdate) {
        await this.docClient.update({
            TableName: this.expensesTable,
            Key: {
                userId: userId,
                expenseId: expenseId
            },
            UpdateExpression: "set #name = :name, #price=:price, #done=:done",
            ExpressionAttributeValues: {
                ":name": expenseUpdate.name,
                ":price": expenseUpdate.price,
            },
            ExpressionAttributeNames: {
                '#name': 'name',
                '#price': 'price',
            },
            ReturnValues: "UPDATED_NEW"
        }).promise()
        logger.info("updated note with id: ", { expenseId })
        return expenseUpdate
    }

    async updateAttachmentUrl(attachmentUrl: string, expenseId: string, userId: string) {
        logger.info('Adding attachement url')
        await this.docClient.update({
            TableName: this.expensesTable,
            Key: { expenseId, userId },
            UpdateExpression:
                'set #attachmentUrl = :attachmentUrl',
            ExpressionAttributeValues: {
                ':attachmentUrl': attachmentUrl
            },
            ExpressionAttributeNames: {
                '#attachmentUrl': 'attachmentUrl'
            },
            ReturnValues: "ALL_NEW"
        }).promise()
        logger.info("Added attachment Url for: ", { expenseId })
        return attachmentUrl
    }
}