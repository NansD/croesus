import React from 'react';
import { render, wait } from '@testing-library/react';
import ExpenseList from './ExpenseList';
import ExpenseService from '../../services/expense.service';

jest.mock('../../services/expense.service');
ExpenseService.getAll.mockReturnValue(
  new Promise((resolve) => {
    resolve([
      {
        _id: '5f26ec88227b457a84f0e84d',
        payer: 'Solène',
        label: 'test1',
        amount: 1,
        usersFor: [
          {
            _id: '5f26ec88227b457a84f0e84e',
            name: 'Nans',
            checked: true,
          },
          {
            _id: '5f26ec88227b457a84f0e84f',
            name: 'Solène',
            checked: true,
          },
        ],
        generatedDebt: [
          {
            _id: '5f26ec88227b457a84f0e850',
            name: 'Nans',
            amount: 0.5,
            to: 'Solène',
          },
          {
            _id: '5f26ec88227b457a84f0e851',
            name: 'Solène',
            amount: -0.5,
            to: 'Solène',
          },
        ],
        submittedAt: '2020-08-02T16:40:40.631Z',
        __v: 0,
      },
      {
        _id: '5f26e0dbf4e48366e0478da8',
        label: 'Yes',
        amount: 100,
        payer: 'Solène',
        usersFor: [
          {
            _id: '5f26e0dbf4e48366e0478da9',
            name: 'Nans',
            checked: true,
          },
          {
            _id: '5f26e0dbf4e48366e0478daa',
            name: 'Solène',
            checked: true,
          },
        ],
        generatedDebt: [
          {
            _id: '5f26e0dbf4e48366e0478dab',
            name: 'Nans',
            amount: 50,
            to: 'Solène',
          },
          {
            _id: '5f26e0dbf4e48366e0478dac',
            name: 'Solène',
            amount: -50,
            to: 'Solène',
          },
        ],
        submittedAt: '2020-08-02T15:50:51.573Z',
        __v: 0,
      },
      {
        _id: '5f26e0da176e0e66dd97a8d4',
        label: 'Yes',
        amount: 100,
        payer: 'Solène',
        usersFor: [
          {
            _id: '5f26e0da176e0e66dd97a8d5',
            name: 'Nans',
            checked: true,
          },
          {
            _id: '5f26e0da176e0e66dd97a8d6',
            name: 'Solène',
            checked: true,
          },
        ],
        generatedDebt: [
          {
            _id: '5f26e0da176e0e66dd97a8d7',
            name: 'Nans',
            amount: 50,
            to: 'Solène',
          },
          {
            _id: '5f26e0da176e0e66dd97a8d8',
            name: 'Solène',
            amount: -50,
            to: 'Solène',
          },
        ],
        submittedAt: '2020-08-02T15:50:50.494Z',
        __v: 0,
      },
      {
        _id: '5f26e0d9d2cb3f66dc01dde1',
        label: 'Yes',
        amount: 100,
        payer: 'Solène',
        usersFor: [
          {
            _id: '5f26e0d9d2cb3f66dc01dde2',
            name: 'Nans',
            checked: true,
          },
          {
            _id: '5f26e0d9d2cb3f66dc01dde3',
            name: 'Solène',
            checked: true,
          },
        ],
        generatedDebt: [
          {
            _id: '5f26e0d9d2cb3f66dc01dde4',
            name: 'Nans',
            amount: 50,
            to: 'Solène',
          },
          {
            _id: '5f26e0d9d2cb3f66dc01dde5',
            name: 'Solène',
            amount: -50,
            to: 'Solène',
          },
        ],
        submittedAt: '2020-08-02T15:50:49.300Z',
        __v: 0,
      },
      {
        _id: '5f26e46b132cd36bcd642be3',
        payer: 'Solène',
        label: 'C',
        amount: 1,
        usersFor: [
          {
            _id: '5f26e46b132cd36bcd642be4',
            name: 'Nans',
            checked: true,
          },
          {
            _id: '5f26e46b132cd36bcd642be5',
            name: 'Solène',
            checked: true,
          },
        ],
        submittedAt: '2020-02-07T23:00:00.000Z',
        generatedDebt: [
          {
            _id: '5f26e46b132cd36bcd642be6',
            name: 'Nans',
            amount: 0.5,
            to: 'Solène',
          },
          {
            _id: '5f26e46b132cd36bcd642be7',
            name: 'Solène',
            amount: -0.5,
            to: 'Solène',
          },
        ],
        __v: 0,
      },
      {
        _id: '5f26e51d81d1b26c1a3ad25c',
        payer: 'Solène',
        label: 'A',
        amount: 1,
        usersFor: [
          {
            _id: '5f26e51d81d1b26c1a3ad25d',
            name: 'Nans',
            checked: true,
          },
          {
            _id: '5f26e51d81d1b26c1a3ad25e',
            name: 'Solène',
            checked: false,
          },
        ],
        submittedAt: '2020-02-07T23:00:00.000Z',
        generatedDebt: [
          {
            _id: '5f26e51d81d1b26c1a3ad25f',
            name: 'Nans',
            amount: 0.5,
            to: 'Solène',
          },
          {
            _id: '5f26e51d81d1b26c1a3ad260',
            name: 'Solène',
            amount: -0.5,
            to: 'Solène',
          },
        ],
        __v: 0,
      },
      {
        _id: '5f26eb8fdb175078a7578b1a',
        payer: 'Solène',
        label: 'AZ',
        amount: 1,
        usersFor: [
          {
            _id: '5f26eb8fdb175078a7578b1b',
            name: 'Nans',
            checked: true,
          },
          {
            _id: '5f26eb8fdb175078a7578b1c',
            name: 'Solène',
            checked: true,
          },
        ],
        submittedAt: '2020-02-07T23:00:00.000Z',
        generatedDebt: [
          {
            _id: '5f26eb8fdb175078a7578b1d',
            name: 'Nans',
            amount: 0.5,
            to: 'Solène',
          },
          {
            _id: '5f26eb8fdb175078a7578b1e',
            name: 'Solène',
            amount: -0.5,
            to: 'Solène',
          },
        ],
        __v: 0,
      },
    ]);
  }),
);

ExpenseService.delete.mockReturnValue(Promise.resolve());

test('renders some expenses', async () => {
  const { findByText } = render(<ExpenseList />);
  const title = await findByText(/test1/i);
  expect(title).toBeInTheDocument();
});

test('deletes an expense', async () => {
  ExpenseService.getAll.mockReturnValue(
    new Promise((resolve) => resolve([
      {
        amount: 100, payer: 'Solène', _id: 'cb0868c0-ada0-11ea-b05c-fb58d34dc57b', submittedAt: 1592071670092, label: 'test',
      },
    ])),
  );

  const { findByLabelText } = render(<ExpenseList />);
  const deleteButton = await findByLabelText('delete');
  deleteButton.click();
  wait(() => {
    expect(deleteButton).not.toBeInTheDocument();
  });
});
