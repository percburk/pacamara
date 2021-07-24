import { useState } from 'react';
import { Button, Menu, MenuItem } from '@material-ui/core';
import { SortState } from '../../models/stateResource';

// Array of sort options
const sortArray = ['Date', 'Country', 'Producer', 'Roaster'];

interface Props {
  sort: SortState;
  setSort: (sort: SortState) => void;
}

// Menu that opens on Dashboard providing all sort options
export default function SortMenu({ sort, setSort }: Props) {
  const [anchorEl, setAnchorEl] = useState<
    (EventTarget & HTMLButtonElement) | null
  >(null);

  // Sets the Sort in local state on Dashboard
  const handleSort = (howToSort: SortState) => {
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
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
      >
        {sortArray.map((option) => (
          <MenuItem
            key={option}
            onClick={() => handleSort(option.toLowerCase() as SortState)}
            selected={sort === option.toLowerCase()}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
