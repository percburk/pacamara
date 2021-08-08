import { useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import queryString from 'query-string';
import { Button, Menu, MenuItem, Chip } from '@material-ui/core';
import { FilterMenuOptions } from '../../models/stateResource';

// Contains all the possible Dashboard filter options
const filtersArray: FilterMenuOptions[] = [
  { filterKey: 'isFav', display: 'Favorites' },
  { filterKey: 'brewing', display: 'Currently Brewing' },
  { filterKey: 'isBlend', display: 'Blends' },
  { filterKey: 'sharedById', display: 'Shared' },
];

// FilterMenu opens on the Dashboard, displaying the options for filtering
// their list of coffees. Filters appear as Chips when clicked, can be deleted
export default function FilterMenu() {
  const location = useLocation();
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState<
    (EventTarget & HTMLButtonElement) | null
  >(null);
  const { q, filters } = queryString.parse(location.search, {
    arrayFormat: 'bracket',
  });

  // Sets the new URL to add/remove entries to the filters array on Dashboard
  const handleFilters = (clickedFilter: string) => {
    const newFiltersArray = !filters
      ? [clickedFilter]
      : filters.includes(clickedFilter)
      ? (filters as string[]).filter((item) => item !== clickedFilter)
      : [...filters, clickedFilter];
    const newString = queryString.stringify(
      { q, filters: newFiltersArray },
      { arrayFormat: 'bracket' }
    );
    history.push(`/dashboard/?${newString}`);
    setAnchorEl(null);
  };

  return (
    <>
      {filtersArray.map((item, i) =>
        filters?.includes(item.filterKey) ? (
          <Chip
            key={i}
            label={item.display}
            onDelete={() => handleFilters(item.filterKey)}
            color="primary"
          />
        ) : null
      )}
      {q && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => history.push('/dashboard')}
        >
          Go Back
        </Button>
      )}
      <Button
        variant="outlined"
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        Filter
      </Button>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
      >
        {filtersArray.map((filter) => (
          <MenuItem
            key={filter.filterKey}
            onClick={() => handleFilters(filter.filterKey)}
            selected={filters?.includes(filter.filterKey)}
          >
            {filter.display}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
