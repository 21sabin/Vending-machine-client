import createDataContext from './createDataContext';
import { instance as api } from '../api/api';

const mainReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'FETCH_ITEMS':
      return { ...state, items: action.payload, loading: false };
    case 'FETCH_CREDIT':
      return { ...state, credit: action.payload, loading: false };
    case 'LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

const getItems = (dispatch: any) => async () => {
  dispatch({ type: 'LOADING', payload: true });
  const { data } = await api.get('/items');
  dispatch({ type: 'FETCH_ITEMS', payload: data });
};

const getCredits = (dispatch: any) => async () => {
  try {
    dispatch({ type: 'LOADING', payload: true });
    const { data } = await api.get('/credits');
    dispatch({ type: 'FETCH_CREDIT', payload: data[0] });
  } catch (error) {
    dispatch({ type: 'LOADING', payload: false });
  }
};

const loadData = (dispatch: any) => async (callback: () => void) => {
  try {
    dispatch({ type: 'LOADING', payload: true });
    await api.get('/items/load');
    dispatch({ type: 'LOADING', payload: false });
    callback();
  } catch (error) {
    dispatch({ type: 'LOADING', payload: false });
  }
};
const buyItem = (dispatch: any) => async (item: any, callback: (success: boolean, msg?: string) => void) => {
  try {
    let message = 'Your item has been purchased successfully '
    dispatch({ type: 'LOADING', payload: true })
    await api.post('/items/buy', item);
    if (item.price > (parseFloat(item.totalPrice))) {
      const refundedAmount = parseInt(item.price) - parseInt(item.totalPrice);
      message = message + `Refunded amount = Rs ${refundedAmount}`
    }
    callback(true, message);
  } catch (error) {
    dispatch({ type: 'LOADING', payload: false })
    const message = error?.response?.data?.message ?? 'Something went wrong';
    callback(false, message);
  }
}

const refundItem = (dispatch: any) => async (item: any, callback: (success: boolean, msg?: string) => void) => {
  try {
    dispatch({ type: 'LOADING', payload: true })
    const response = await api.post('/items/refund', item);
    dispatch({ type: 'LOADING', payload: false })
    callback(true, 'Your item has been refunded successfully');
  } catch (error) {
    dispatch({ type: 'LOADING', payload: false })
    const message = error?.response?.data?.message ?? 'Something went wrong';
    callback(false, message);
  }
}

export const { Context, Provider } = createDataContext(
  mainReducer,
  { getItems, getCredits, buyItem, refundItem, loadData },
  { loading: false, items: [], credit: {} }
);
