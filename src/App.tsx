import { useState } from 'react';
import List from './List';
import { increment } from './store/counter';
import { updateItems, addItems } from './store/items';
import { useAppDispatch } from './store/store';

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  const [showList, setShowList] = useState(true);

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
          <button
            onClick={() => dispatch(addItems(5))}
          >
            Add 5 items to list (force new components)
          </button>
          <button
            onClick={() => setShowList(!showList)}
          >
            Toggle list visibility
          </button>
        </div>
        <hr />
        <h3>The problem</h3>
        <span>
          Using <code>useSelector</code> within a row results in multiple versions of the store being kept in memory when you dynamically add additional rows.
          By pressing the Update data set, all rows will be updated, with new data, resulting in a new version of the store.
          This is to be expected. However when you add additional rows within the list and then update twice (?), you will see the memory usage increasing and when taking a snapshot you can also see multiple versions of the store being retained in memory.
          Different rows will have different references to the store while they all use the same selector, this is not what you would expect to happen.
          You can clearly see the 5 new rows having a new reference, but the old components still reference their initial store even though they all rerendered.
        </span>
        <hr />
        <h3>Libraries involved:</h3>
        <ul>
          <li>react 16/17/18</li>
          <li>react-redux@8.0.5</li>
        </ul>
        <h3>Reproduction steps</h3>
        <span>Note: the amount of memory used may differ per machine, but the increase should be visible</span>
        <ol>
          <li>
            Create a memory snapshot (should be relatively small)
          </li>
          <li>
            Update the data set twice and create another memory snapshot
          </li>
          <li>
            The memory total should be larger than before
          </li>
          <li>
            Update the data set again and create another memory snapshot
          </li>
          <li>
            The memory should be similar in size
          </li>
        </ol>
        <div>
          <p>
            Repeating step 4 & 5 should not increase the size of the memory snapshot by ~1mb, it may increase slightly.
          </p>
          <p>
            When you search for <code>text 1 blob</code> in the memory snapshot you should see that there are a few occurences within the <code>(string)</code> section, including this string.
            The value after <code>blob</code> is the value that is randomly updated when pressing the button. So you should find for example an occurence with the value of 0, 2 and 3.
            The reference to 0 is always present here and the other two are the previous value and the current(new) value when the date set has been updated.
          </p>
          <p>
            So far so good. Lets continue to actual reproduce the problem.
          </p>
          <ol
            start={6}
          >
            <li>
              Press the add 5 items to list and press update the data set twice
            </li>
            <li>
              Create a memory snapshot and see increase
            </li>
            <li>
              Repeat step 6 & 7 several times and see that the size of the memory snapshot will be increasing with each iteration, resulting in more and more references to different versions of the store,
              Even rerenders of previous components never update to the new reference, they seem to keep the old reference to the store version of their time of creation.
            </li>
          </ol>
          <div>
            <p>
              When you look at the memory snapshots you can see that <code>text 1 blob</code> is present more and more times now where some occurences have pointers to the "memoizedSnapshot"
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
          <li>Not using a useSelector within a column in the react-window list</li>
          <li>Making sure the selector always returns something new as that updates the memoizedSnapshot in the hook</li>
        </ul>
        <h3>Why does this seem to happen</h3>
        <ul>
          <li>
            Because components are mounted on different moments of time, the selectors get subscribed at different moments in time, resulting in references to different versions of the store, this reference never gets updated.
          </li>
        </ul>
      </div>
      <div>
        The list
        {showList && <List />}
      </div>
    </div>
  );
};

export default App;