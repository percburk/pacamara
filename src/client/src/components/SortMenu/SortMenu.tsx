import { useState } from 'react'
import { Button, Menu, MenuItem } from '@material-ui/core'
// Models
import { SortState } from '../../models/stateResource'

// Array of sort options
const sortOptions: SortState[] = ['date', 'country', 'producer', 'roaster']

interface Props {
  sort: SortState
  setSort: (sort: SortState) => void
}

// Menu that opens on Dashboard providing all sort options
export default function SortMenu({ sort, setSort }: Props) {
  const [anchorEl, setAnchorEl] = useState<(EventTarget & HTMLButtonElement) | null>(null)

  // Capitalize sort option to display on menu
  const uppercaseFirstLetter = (word: string) =>
    word.slice(0, 1).toUpperCase() + word.slice(1)

  // Sets the Sort in local state on Dashboard
  const handleSort = (howToSort: SortState) => {
    setSort(howToSort)
    setAnchorEl(null)
  }

  return (
    <>
      <Button variant="outlined" onClick={(event) => setAnchorEl(event.currentTarget)}>
        Sort
      </Button>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
      >
        {sortOptions.map((option) => (
          <MenuItem
            key={option}
            onClick={() => handleSort(option)}
            selected={sort === option}
          >
            {uppercaseFirstLetter(option)}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}
