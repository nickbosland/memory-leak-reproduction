import { createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';

export interface Item {
  id: number;
  value: number;
  text: string;
}

const generateData = (amount: number): Item[] => {
  const items: Item[] = [];

  for (let i = 0; i < amount; i++) {
    items.push({
      id: i,
      value: 0,
      text: ['text', i, 'blob', 0, new Array(1_000).join('****')].join(' '),
    });
  }

  return items;
};

const itemsSlice = createSlice({
  name: 'items',
  initialState: generateData(200),
  reducers: {
    update: (state) => [...state].map(({ id, value, text }) => {
      const newValue = Date.now() % id === 0 ? value + 1 : value;
      const [tText, tId, tBlob, _tValue, tRest] = text.split(' ');

      return {
        id,
        value: newValue,
        text: [tText, tId, tBlob, newValue, tRest].join(' '),
      };
    }),
  }
});

export const itemsReducer = itemsSlice.reducer;
export const { update: updateItems } = itemsSlice.actions;