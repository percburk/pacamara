const snackbarsReducer = (state = '', action) => {
  switch (action.type) {
    case 'SNACKBARS_ADDED_COFFEE':
      return { string: 'New Coffee Added', open: true };
    case 'SNACKBARS_CREATED_PROFILE':
      return { string: 'New Profile Created', open: true };
    case 'SNACKBARS_UPDATED_PROFILE':
      return { string: 'Profile Updated', open: true };
    case 'SNACKBARS_DELETED_COFFEE':
      return { string: 'Coffee Deleted', open: true };
    case 'SNACKBARS_EDITED_COFFEE':
      return { string: 'Coffee Updated', open: true };
    case 'CLEAR_SNACKBARS':
      return { string: '', open: false };
    default:
      return state;
  }
};

export default snackbarsReducer;
