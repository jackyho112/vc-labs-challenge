import React from 'react';
import Select from 'react-select';

function SortingBar({ currentOption, selectAsCurrent, reverseOrder, options }) {
  return (
    <div>
      <Select
        value={currentOption}
        options={options}
        onChange={option => selectAsCurrent(option)}
      />
      <button onClick={() => reverseOrder()}>
        Reverse order
      </button>
    </div>
  );
}

export default SortingBar;
