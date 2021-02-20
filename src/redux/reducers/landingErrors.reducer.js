// This holds the string that will display on login if there's an error
// along with the status of the Collapse being open to display the message
const landingErrors = (state = '', action) => {
  switch (action.type) {
    case 'CLEAR_LANDING_ERROR':
      return { string: '', open: false };
    case 'LOGIN_INPUT_ERROR':
      return { string: 'Please enter your username and password.', open: true };
    case 'LOGIN_FAILED':
      return {
        string: `The username and password didn't match. Please try again.`,
        open: true,
      };
    case 'LOGIN_FAILED_NO_CODE':
      return { string: 'Something went wrong. Please try again.', open: true };
    case 'REGISTRATION_INPUT_ERROR':
      return { string: 'Please choose a username and password.', open: true };
    case 'REGISTRATION_FAILED':
      return {
        string: `That didn't work. The username might already be taken. Please try again.`,
        open: true,
      };
    default:
      return state;
  }
};

export default landingErrors;
