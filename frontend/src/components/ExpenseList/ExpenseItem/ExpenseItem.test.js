import React from 'react';
import { render } from '@testing-library/react';
import ExpenseItem from './ExpenseItem';
import ExpenseService from '../../../services/expense.service';

jest.mock('../../../services/expense.service');
ExpenseService.deleteExpense.mockReturnValue();

const deleteExpense = () => {};

const goodExpense = (
  <ExpenseItem
    expense={{
      amount: 100, payer: 'Solène', id: 'cb0868c0-ada0-11ea-b05c-fb58d34dc57b', submittedAt: 1592071670092, label: 'test',
    }}
    deleteExpense={deleteExpense}
  />
);

test('renders an expense', () => {
  const { getByText } = render(goodExpense);
  const payer = getByText(/Solène/i);
  expect(payer).toBeInTheDocument();
});

test('renders an amount', () => {
  const { getByText } = render(goodExpense);
  const amount = getByText(/100 €/i);
  expect(amount).toBeInTheDocument();
});

test('enables to delete an expense', () => {
  const { getByLabelText } = render(goodExpense);
  const deleteButton = getByLabelText('delete');
  deleteButton.click();
  expect(ExpenseService.deleteExpense).toBeCalledWith('cb0868c0-ada0-11ea-b05c-fb58d34dc57b');
});

export default goodExpense;
