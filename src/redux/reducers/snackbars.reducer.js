// snackbarsReducer contains all the messages and color schemes of Snackbars
// displayed throughout the app. They're called from multiple components
const snackbarsReducer = (state = { string: '', open: false }, action) => {
  switch (action.type) {
    case 'SNACKBARS_CREATED_PROFILE':
      return { string: 'New Profile Created', open: true, severity: 'success' };
    case 'SNACKBARS_UPDATED_PROFILE':
      return { string: 'Profile Updated', open: true, severity: 'info' };
    case 'SNACKBARS_METHODS_ERROR':
      return {
        string: 'Please select at least one brew method',
        open: true,
        severity: 'error',
      };
    case 'SNACKBARS_FLAVORS_ERROR':
      return {
        string: 'Please select at least one flavor',
        open: true,
        severity: 'error',
      };
    case 'SNACKBARS_ADDED_COFFEE':
      return { string: 'New Coffee Added', open: true, severity: 'success' };
    case 'SNACKBARS_EDITED_COFFEE':
      return { string: 'Coffee Updated', open: true, severity: 'info' };
    case 'SNACKBARS_DELETED_COFFEE':
      return { string: 'Coffee Deleted', open: true, severity: 'info' };
    case 'SNACKBARS_ADDED_BREW':
      return { string: 'New Brew Added', open: true, severity: 'success' };
    case 'SNACKBARS_EDITED_BREW':
      return { string: 'Brew Edited', open: true, severity: 'info' };
    case 'SNACKBARS_DELETED_BREW':
      return { string: 'Brew Deleted', open: true, severity: 'info' };
    case 'SNACKBARS_SENT_SHARED_COFFEE':
      return { string: 'Coffee Sent', open: true, severity: 'success' };
    case 'SNACKBARS_DECLINED_SHARED_COFFEE':
      return { string: 'Shared Coffee Declined', open: true, severity: 'info' };
    case 'SNACKBARS_ADDED_SHARED_COFFEE':
      return {
        string: 'Coffee Added to your Dashboard',
        open: true,
        severity: 'success',
      };
    case 'CLEAR_SNACKBARS':
      return { string: '', open: false };
    default:
      return state;
  }
};

export default snackbarsReducer;
