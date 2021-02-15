const snackbarsReducer = (state = '', action) => {
  switch (action.type) {
    case 'SNACKBARS_ADDED_COFFEE':
      return { string: 'New Coffee Added', open: true, severity: 'success' };
    case 'SNACKBARS_CREATED_PROFILE':
      return { string: 'New Profile Created', open: true, severity: 'success' };
    case 'SNACKBARS_UPDATED_PROFILE':
      return { string: 'Profile Updated', open: true, severity: 'info' };
    case 'SNACKBARS_DELETED_COFFEE':
      return { string: 'Coffee Deleted', open: true, severity: 'info' };
    case 'SNACKBARS_EDITED_COFFEE':
      return { string: 'Coffee Updated', open: true, severity: 'info' };
    case 'SNACKBARS_ADDED_BREW':
      return { string: 'New Brew Added', open: true, severity: 'success' };
    case 'SNACKBARS_DELETED_BREW':
      return { string: 'Brew Deleted', open: true, severity: 'info' };
    case 'CLEAR_SNACKBARS':
      return { string: '', open: false, severity: '' };
    default:
      return state;
  }
};

export default snackbarsReducer;
