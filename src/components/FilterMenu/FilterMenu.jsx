import { useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import queryString from 'query-string';
import { Button, Menu, MenuItem, Chip } from '@material-ui/core';

// Contains all the possible Dashboard filter options
const filtersArray = [
  { key: 'is_fav', string: 'Favorites' },
  { key: 'brewing', string: 'Currently Brewing' },
  { key: 'is_blend', string: 'Blends' },
  { key: 'shared_by_id', string: 'Shared' },
];

// FilterMenu opens on the Dashboard, displaying the options for filtering
// their list of coffees. Filters appear as Chips when clicked, can be deleted
function FilterMenu() {
  const location = useLocation();
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);
  const { textSearch, filters } = queryString.parse(location.search, {
    arrayFormat: 'bracket',
  });

  // Sets the new URL to add/remove entries to the filters array on Dashboard
  const handleFilters = (clickedFilter) => {
    const newFiltersArray = !filters
      ? [clickedFilter]
      : filters.includes(clickedFilter)
      ? filters.filter((item) => item !== clickedFilter)
      : [...filters, clickedFilter];
    const newString = queryString.stringify(
      { textSearch, filters: newFiltersArray },
      { arrayFormat: 'bracket' }
    );
    history.push(`/dashboard/?${newString}`);
    setAnchorEl(null);
  };

  return (
    <>
      {filtersArray.map((item, i) => {
        if (filters?.includes(item.key)) {
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
        {filtersArray.map((item, i) => (
          <MenuItem
            key={i}
            onClick={() => handleFilters(item.key)}
            selected={filters?.includes(item.key)}
          >
            {item.string}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export default FilterMenu;
