import { useLocation } from 'react-router-dom';

// useQuery is a custom hook for React Router to extract the query string
// from the URL
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default useQuery;
