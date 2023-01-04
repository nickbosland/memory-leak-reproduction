
import React from 'react';
import { useSelector } from 'react-redux';
import { ListChildComponentProps, VariableSizeList } from 'react-window';
import type { Item } from './store/items';
import { counterSelector, itemsSelector } from './store/selectors';
import { useAppSelector } from './store/store';

const COLUMNS = [
  'id',
  'value',
  'redux',
];

const ColumnWithUseSelector = () => {
  const counterValue = useSelector(counterSelector);

  return (
    <div>
      {`Counter: ${counterValue}`}
    </div>
  );
};

const RowColumn: React.FC<{ item: Item, column: string }> = ({ item, column }) => {
  if (column === 'redux') {
    return (
      <ColumnWithUseSelector />
    );
  }

  return (
    <div
      key={`row-item-advanced-column-${item.id}`}
    >
      {/* @ts-ignore */}
      {item[column]}
    </div>
  );
};

const Row: React.FC<{ item: Item, style: React.CSSProperties }> = ({ item, style }) => {
  return (
    <div
      key={`row-item-advanced-${item.id}-container`}
      style={style}
    >
      <div
        key={`row-item-advanced-${item.id}-container-flex`}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        {COLUMNS.map((column) => {
          return (
            <RowColumn
              key={`row-item-advanced-${item.id}-column-${column}`}
              item={item}
              column={column}
            />
          );
        })}
      </div>
    </div>
  );
};

const ListRow: React.FC<ListChildComponentProps<{ items: Item[] }>> = ({ data, index, style }) => {
  const { items } = data;

  const item = items[index];

  return (
    <Row
      key={`row-item-advanced-${item.id}`}
      item={item}
      style={style}
    />
  );
};

const List: React.FC = () => {
  const items = useAppSelector(itemsSelector);

  return (
    <VariableSizeList
      height={800}
      width={600}
      itemCount={items.length}
      itemData={{ items }}
      itemKey={(index, tableDataProps) => tableDataProps.items[index].id}
      itemSize={() => 20}
    >
      {ListRow}
    </VariableSizeList>
  );
};

export default List;
