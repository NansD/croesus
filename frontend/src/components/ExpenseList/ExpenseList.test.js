import React from 'react';
import { render, wait } from '@testing-library/react';
import ExpenseList from './ExpenseList';
import ExpenseService from '../../services/expense.service';

jest.mock('../../services/expense.service');
ExpenseService.getAll.mockReturnValue(
  {
    expenses:
      [
        {
          amount: 100, payer: 'Solène', id: 'cb0868c0-ada0-11ea-b05c-fb58d34dc57b', submittedAt: 1592071670092, label: 'test1',
        },
        {
          amount: 100, payer: 'Nans', id: '882e3ee0-ad81-11ea-8856-a19105bf184b', submittedAt: 1592058243534, label: 'test2',
        },
        {
          amount: 100, payer: 'Nans', id: 'cf5099c0-ada0-11ea-b05c-fb58d34dc57b', submittedAt: 1592071677276, label: 'test3',
        },
      ],
  },
);

ExpenseService.deleteExpense.mockReturnValue(Promise.resolve());

test('renders some expenses', async () => {
  const { findByText } = render(<ExpenseList />);
  const title = await findByText(/test1/i);
  expect(title).toBeInTheDocument();
});

test('deletes an expense', async () => {
  ExpenseService.getAll.mockReturnValue(
    {
      expenses:
        [
          {
            amount: 100, payer: 'Solène', id: 'cb0868c0-ada0-11ea-b05c-fb58d34dc57b', submittedAt: 1592071670092, label: 'test',
          },
        ],
    },
  );
  const { findByLabelText } = render(<ExpenseList />);
  const deleteButton = await findByLabelText('delete');
  deleteButton.click();
  wait(() => {
    expect(deleteButton).not.toBeInTheDocument();
  });
});
