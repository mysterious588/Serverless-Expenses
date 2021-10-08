import { ExpensesAccess } from '../dataLayer/expensesAccess'
import { AttachmentUtils } from '../dataLayer/attachmentUtils';
import { ExpenseItem } from '../models/ExpenseItem'
import { CreateExpenseRequest } from '../requests/CreateExpenseRequest'
import { UpdateExpenseRequest } from '../requests/UpdateExpenseRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
//import * as createError from 'http-errors'

const expensesAccess = new ExpensesAccess()
const attachmentUtils = new AttachmentUtils()

const logger = createLogger('expenses')

export async function createExpense(createExpenseRequest: CreateExpenseRequest, userId: string): Promise<ExpenseItem> {

    const expenseId = uuid.v4()
    const name = createExpenseRequest.name
    const createdAt = new Date().toString()
    const price = createExpenseRequest.price

    const expenseItem: ExpenseItem = {
        userId,
        expenseId,
        price,
        createdAt,
        name,
    }

    logger.info('creating expense with id: ', expenseId)
    return await expensesAccess.createExpense(expenseItem)
}

export async function updateExpense(updateExpenseRequest: UpdateExpenseRequest, expenseId: string, userId: string,) {
    logger.info('updating expense with id: ', expenseId)
    return await expensesAccess.updateExpense(expenseId, userId, updateExpenseRequest)
}

export async function deleteExpense(expenseId: string, userId: string) {
    logger.info('deleting expense with id: ', expenseId)
    return await expensesAccess.deleteExpense(expenseId, userId)
}

export async function getExpensesForUser(userId) {
    logger.info('getting expenses for user: ', userId)
    return await expensesAccess.getExpenses(userId)
}

export async function createAttachmentPresignedUrl(expenseId: string, userId) {
    logger.info('creating image url for expense: ', {expenseId})
    const attachement_url = attachmentUtils.createAttachmentPresignedUrl(expenseId)
    return await expensesAccess.updateAttachmentUrl(attachement_url, expenseId, userId)
}
