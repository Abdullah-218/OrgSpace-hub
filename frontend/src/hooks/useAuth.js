/**
 * Authentication Hook
 * Re-export from AuthContext for convenience
 */

import { useAuth as useAuthContext } from '../context/AuthContext';

export const useAuth = () => {
  return useAuthContext();
};

export default useAuth;