import { useState } from 'react';

export default function useInput(initialValue) {
  const [value, setValue] = useState(initialValue);

  return [
    value,
    setValue,
    () => setValue(initialValue),
    {
      value: value || '',
      onChange: (event) => {
        setValue(event.target.value);
      },
    },
  ];
}
