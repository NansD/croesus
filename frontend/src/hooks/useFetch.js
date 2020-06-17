import { useState, useEffect } from 'react';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

export default (resource, ref, initialValue) => {
  const [data, setData] = useState(initialValue);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const url = `${apiBaseUrl}/${resource}`;

  useEffect(() => {
    if (ref.current) {
      (async () => {
        try {
          const res = await fetch(url);
          const resJson = await res.json();
          setData(resJson);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      })();
    }
    return function cleanUp() {
      // eslint-disable-next-line no-param-reassign
      ref.current = false;
    };
  }, [url, ref]);
  return { loading, data, error };
};
