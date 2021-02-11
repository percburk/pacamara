const snackbarsReducer = (state = '', action) => {
  switch (action.type) {
    case 'SNACKBARS_ADDED_COFFEE':
      return 'New Coffee Added';
    case 'SNACKBARS_CREATED_PROFILE':
      return 'New Profile Created';
    case 'SNACKBARS_UPDATED_PROFILE':
      return 'Profile Updated';
    case 'SNACKBARS_DELETED_COFFEE':
      return 'Coffee Deleted';
    case 'SNACKBARS_UPDATED_COFFEE':
      return 'Coffee Updated';
    case 'CLEAR_SNACKBARS':
      return '';
    default:
      return state;
  }
};

export default snackbarsReducer;
