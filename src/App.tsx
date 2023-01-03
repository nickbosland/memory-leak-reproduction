import List from './List';
import { increment } from './store/counter';
import { updateItems } from './store/items';
import { useAppDispatch } from './store/store';

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: 16
      }}
    >
      <div>
        <button
          onClick={() => dispatch(updateItems())}
        >
          Update data set
        </button>
        <button
          onClick={() => dispatch(increment())}
        >
          Increment counter
        </button>
      </div>
      <List />
    </div>
  );
};

export default App;