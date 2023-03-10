import { useState } from 'react';
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
      <div style={{ padding: 16 }}>
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
        <hr />
        <h3>The problem</h3>
        <span>
          Using react-window in combination with <code>useSelector</code> within a row results in multiple versions of the store being kept in memory.
          By pressing the Update data set, rows will be "randomly" updated, with new data, resulting in a new version of the store.
          This is to be expected. However when you scroll within the list and then update, you will see the memory usage increasing and when taking a snapshot you can also see multiple versions of the store being retained in memory.
          Different rows will have different references to the store while they all use the same selector, this is not what you would expect to happen.
        </span>
        <h3>Snapshots</h3>
        <p>
          The repository includes a few snapshots that give insight into the problem. These snapshots are created using the reproduction steps below.
          These snapshots can be loaded into chrome/edge.
        </p>
        <hr />
        <h3>Libraries involved:</h3>
        <ul>
          <li>react 16/17/18</li>
          <li>react-redux@8.0.5</li>
          <li>react-window@1.8.8</li>
        </ul>
        <h3>Reproduction steps</h3>
        <span>Note: the amount of memory used may differ per machine, but the increase should be visible</span>
        <ol>
          <li>
            Create a memory snapshot(should be ~3.4mb)
          </li>
          <li>
            Update the data set
          </li>
          <li>
            Create a memory snapshot(should be ~4.6mb)
          </li>
          <li>
            Update the data set
          </li>
          <li>
            Create a memory snapshot(should be ~5.6mb).
          </li>
        </ol>
        <div>
          <p>
            Repeating step 4 & 5 should not increase the size of the memory snapshot by ~1mb, it may increase slightly.
          </p>
          <p>
            When you search for <code>text 1 blob</code> in the memory snapshot you should see that there are 4 occurences within the <code>(string)</code> section, including this string.
            The value after <code>blob</code> is the value that is randomly updated when pressing the button. So you should find for example an occurence with the value of 0, 2 and 3.
            The reference to 0 is always present here and the other two are the previous value and the current(new) value when the date set has been updated.
          </p>
          <p>
            Another thing that can be checked is within the <code>Array</code> section. This now has 3 entries which are fairly large(~640000). This is the "items" array that is kept in memory
            by fiber to check if the components need to be updated(not 100% if this statement is correct)
          </p>
          <p>
            So far so good. Lets continue to actual reproduce the problem.
          </p>
          <ol
            start={6}
          >
            <li>
              Scroll a bit in the list, one tick of scrolling should be enough (a few rows)
            </li>
            <li>
              Update the data set
            </li>
            <li>
              Create a memory snapshot
            </li>
            <li>
              Repeat step 6 to 8 several times and see the size of the memory snapshot increasing with each iteration
            </li>
          </ol>
          <div>
            <p>
              When you look at the memory snapshots you can see that <code>text 1 blob</code> is present more than 4 times now where some occurences have pointers to the "memoizedSnapshot"
              that has a reference to a version of the "items" array. This can also be seen in the <code>Array</code> section.
            </p>
            <p>
              This problem is caused by the "redux" column which has a `useSelector`. When the "redux" column is no longer rendered or the `useSelector` is removed from the component the
              large memory increase no longer happens. There is still a slight increase in the memory snapshot but nowhere near as large as with the the "redux" column.
            </p>
            <p>
              The "redux" column can be removed by removing "redux" from the "COLUMNS" array in "List.tsx"
            </p>
          </div>
        </div>
        <h3>When does it not happen</h3>
        <ul>
          <li>Not using react-window, simply rendering the whole list this will prevent this problem from occuring</li>
          <li>Not using a useSelector within a column in the react-window list</li>
        </ul>
        <h3>Possible pointers on why this happens</h3>
        <span>There are multiple thoughts about why this might happen, but we're not sure about the exact cause.</span>
        <ul>
          <li>
            Because components are mounted on different moments of time, the selectors get subscribed at different moments in time, resulting in references to different versions of the store
          </li>
          <li>
            Because components subscribed to redux, have their selector triggered, but do not result in an update, which also doesn't update the input reference of the selector, this might result in multiple versions of the store being referenced.
          </li>
        </ul>
      </div>
      <div>
        The scrollable list:
        <List />
      </div>
    </div>
  );
};

export default App;