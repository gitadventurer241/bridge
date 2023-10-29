import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import axios from "axios";

interface AuthObject {
  user?: {
    id: string;
    // Other user properties
  };
}

interface AuthContextType {
  auth: AuthObject; // Use a general object type
  setAuth: Dispatch<SetStateAction<object>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Auth state
  const [auth, setAuth] = useState<object>({});

  useEffect(() => {
    localStorage.getItem("auth") &&
      setAuth(JSON.parse(localStorage.getItem("auth") || "{}"));
  }, []);
  // axios config for all requests
  if (window.location.hostname === "localhost") {
    // Local environment
    axios.defaults.baseURL = process.env.REACT_APP_API_DEV;
  } else {
    // App Engine environment or other deployment
    axios.defaults.baseURL = process.env.REACT_APP_API_PROD;
  }
  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
