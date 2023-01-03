import { RootState } from './store';

export const counterSelector = (state: RootState) => state.counter;
export const itemsSelector = (state: RootState) => state.items;
