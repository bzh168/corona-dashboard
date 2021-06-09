import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

function checkStatus(response: any) {
  if (response.ok) {
    return response;
  }
  const error = new Error(response.statusText);
  throw error;
}

export function fetchAndCheck(url: string, options = {}) {
  Object.assign(options, { credentials: 'same-origin' });

  return fetch(url, options)
    .catch((err) => {
      throw new Error(err.messge);
    })
    .then(checkStatus);
}

export function getData(url: string) {
  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  };
  return fetchAndCheck(url, options).then((response) => response.json());
}

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
