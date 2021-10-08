import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createExpense, deleteExpense, getExpenses, patchExpense } from '../api/expenses-api'
import Auth from '../auth/Auth'
import { ExpenseItem } from '../types/Expense'

interface ExpensesProps {
  auth: Auth
  history: History
}

interface ExpenseState {
  expenses: ExpenseItem[]
  newExpenseName: string
  newExpensePrice: number
  loadingExpenses: boolean
}

export class Expenses extends React.PureComponent<ExpensesProps, ExpenseState> {
  state: ExpenseState = {
    expenses: [],
    newExpenseName: '',
    newExpensePrice: 0,
    loadingExpenses: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newExpenseName: event.target.value })
  }

  handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newExpensePrice: parseInt(event.target.value) })
  }

  onEditButtonClick = (expenseId: string) => {
    this.props.history.push(`/expenses/${expenseId}/edit`)
  }

  onExpenseCreate = async () => {
    try {
      const newExpense = await createExpense(this.props.auth.getIdToken(), {
        name: this.state.newExpenseName,
        price: this.state.newExpensePrice
      })
      this.setState({
        expenses: [...this.state.expenses, newExpense],
        newExpenseName: ''
      })
    } catch {
      alert('Expense creation failed')
    }
  }

  onExpenseDelete = async (expenseId: string) => {
    try {
      await deleteExpense(this.props.auth.getIdToken(), expenseId)
      this.setState({
        expenses: this.state.expenses.filter(expense => expense.expenseId !== expenseId)
      })
    } catch {
      alert('Expense deletion failed')
    }
  }

  async componentDidMount() {
    try {
      const expenses = await getExpenses(this.props.auth.getIdToken())
      this.setState({
        expenses,
        loadingExpenses: false
      })
    } catch (e) {
      if (e instanceof Error)
        alert(`Failed to fetch expenses: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Expenses</Header>

        {this.renderCreateExpenseInput()}

        {this.renderExpenses()}
      </div>
    )
  }

  renderCreateExpenseInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            fluid
            actionPosition="left"
            placeholder="Expense Name"
            onChange={this.handleNameChange}
          />
          <Input
            fluid
            actionPosition="left"
            placeholder="Price"
            onChange={this.handlePriceChange}
          />
          <Grid.Column>
            <Button onClick={this.onExpenseCreate}
            color='red'>
              Add Expense
            </Button>
          </Grid.Column>
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderExpenses() {
    if (this.state.loadingExpenses) {
      return this.renderLoading()
    }

    return this.renderExpensesList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Expenses
        </Loader>
      </Grid.Row>
    )
  }

  renderExpensesList() {
    return (
      <Grid padded>
        {this.state.expenses.map((expense, pos) => {
          return (
            <Grid.Row key={expense.expenseId}>
              <Grid.Column width={10} verticalAlign="middle">
                {expense.name}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {expense.price + '$'}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(expense.expenseId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onExpenseDelete(expense.expenseId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {expense.attachmentUrl && (
                <Image src={expense.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }
}
