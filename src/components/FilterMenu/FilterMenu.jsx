import { useState } from 'react';
import { Button, Menu, MenuItem, Chip } from '@material-ui/core';

// Contains all the possible Dashboard filter options
const filtersArray = [
  { key: 'fav', string: 'Favorites' },
  { key: 'brewing', string: 'Currently Brewing' },
  { key: 'blend', string: 'Blends' },
  { key: 'shared', string: 'Shared' },
];

// FilterMenu opens on the Dashboard, displaying the options for filtering 
// their list of coffees. Filters appear as Chips when clicked, can be deleted
function FilterMenu({ filters, setFilters }) {
  const [anchorEl, setAnchorEl] = useState(null);

  // Sets the filters in local state on Dashboard
  const handleFilters = (howToFilter) => {
    setFilters({ ...filters, [howToFilter]: !filters[howToFilter] });
    setAnchorEl(null);
  };

  return (
    <>
      {filtersArray.map((item, i) => {
        if (filters[item.key]) {
          return (
            <Chip
              key={i}
              label={item.string}
              onDelete={() => handleFilters(item.key)}
              color="primary"
            />
          );
        }
      })}
      <Button
        variant="outlined"
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        Filter
      </Button>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {filtersArray.map((item, i) => {
          return (
            <MenuItem
              key={i}
              onClick={() => handleFilters(item.key)}
              selected={filters[item.key]}
            >
              {item.string}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}

export default FilterMenu;
