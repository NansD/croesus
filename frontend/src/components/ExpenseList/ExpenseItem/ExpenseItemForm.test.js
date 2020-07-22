import React from 'react';
import { render, wait } from '@testing-library/react';
import { toast } from 'react-toastify';

import userEvent from '@testing-library/user-event';
import ExpenseItemForm from './ExpenseItemForm';
import ExpenseService from '../../../services/expense.service';

jest.mock('../../../services/expense.service');
jest.mock('react-toastify');

ExpenseService.createExpense.mockReturnValue(Promise.resolve());

const createExpense = jest.fn();
const goodExpenseItemForm = (
  <ExpenseItemForm createExpense={createExpense} />
);

test('it renders', () => {
  const { getByText } = render(goodExpenseItemForm);
  const createExpenseButton = getByText('Créer une dépense');
  expect(createExpenseButton).toBeInTheDocument();
});

test('it enables to submit an expense', () => {
  const payer = 'Nans';
  const label = 'Boulangerie';
  const amount = '130';
  const {
    getByPlaceholderText, getByLabelText, getByText,
  } = render(goodExpenseItemForm);

  getByText('Créer une dépense').click();

  // add a payer
  const payerInput = getByLabelText('payer');
  userEvent.selectOptions(payerInput, payer);
  expect(getByText(payer)).toBeInTheDocument();

  // add a label
  const labelInput = getByPlaceholderText('Motif');
  userEvent.type(labelInput, label);

  // add an amount
  const amountInput = getByPlaceholderText('Montant');
  userEvent.type(amountInput, amount);

  const submitButton = getByText('Sauvegarder');
  submitButton.click();

  expect(toast.error).not.toHaveBeenCalled();
  wait(() => {
    expect(toast.success).toHaveBeenCalled();
    expect(createExpense).toHaveBeenCalled();
  });
});
