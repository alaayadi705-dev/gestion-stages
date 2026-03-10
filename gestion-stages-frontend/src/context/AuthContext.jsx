import { createContext, useState } from "react";
import { loginAPI } from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [auth, setAuth] = useState(
    localStorage.getItem("token") !== null
  );

  const login = async (email, password) => {

    const data = await loginAPI(email, password);

    localStorage.setItem("token", data.token);

    setAuth(true);

  };

  const logout = () => {

    localStorage.removeItem("token");

    setAuth(false);

  };

  return (

    <AuthContext.Provider
      value={{
        auth,
        login,
        logout
      }}
    >

      {children}

    </AuthContext.Provider>

  );

};