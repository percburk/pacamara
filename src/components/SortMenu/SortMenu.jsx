import { useState } from 'react';
import { Button, Menu, MenuItem } from '@material-ui/core';

const sortArray = ['Date', 'Country', 'Producer', 'Roaster'];

function SortMenu({ sort, setSort }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleSort = (howToSort) => {
    setSort(howToSort);
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        Sort
      </Button>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {sortArray.map((item, i) => (
          <MenuItem
            key={i}
            onClick={() => handleSort(item.toLowerCase())}
            selected={sort === item.toLowerCase() ? true : false}
          >
            {item}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export default SortMenu;
