import React from 'react';
import { render } from '@testing-library/react';
import ExpenseList from './ExpenseList';
import { rest } from 'msw';
import {setupServer} from 'msw/node';
import { useFetch } from "../../hooks/useFetch";
jest.mock('../../hooks/useFetch')
useFetch.mockReturnValue({
  data : { 
    expenses: 
      [
        {"amount":100,"payer":"Solène","id":"cb0868c0-ada0-11ea-b05c-fb58d34dc57b","submittedAt":1592071670092,"label":"test"},
        {"amount":100,"payer":"Nans","id":"882e3ee0-ad81-11ea-8856-a19105bf184b","submittedAt":1592058243534,"label":"test"},
        {"amount":100,"payer":"Nans","id":"cf5099c0-ada0-11ea-b05c-fb58d34dc57b","submittedAt":1592071677276,"label":"test"}
      ] 
  }
})

test('renders some expenses', () => {
  const { getByText } = render(<ExpenseList />);
  const title = getByText(/Solène/i);
  expect(title).toBeInTheDocument();
});