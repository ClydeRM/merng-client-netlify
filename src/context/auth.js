import React, { useReducer, createContext } from "react";
import jwtDecode from "jwt-decode";

//TODO search useReducer react hook

const initialState = {
  user: null,
};

// Check Local Token have expired?
if (localStorage.getItem("jwtToken")) {
  const decodedToken = jwtDecode(localStorage.getItem("jwtToken"));

  // decodedToken.exp is milliseconds unit
  // jwt.sign generate Date.now() / 1000 basically
  // so check expiration can decode token and exp * 1000 compare to local time
  if (decodedToken.exp * 1000 < Date.now()) {
    // Token is expired
    localStorage.removeItem("jwtToken");
  } else {
    // Token is not expired, user can use it
    // initialState will pass to AuthProvider
    initialState.user = decodedToken;
  }
}

// 3:21:00
const AuthContext = createContext({
  // initialState of Context data
  user: null,
  login: (userData) => {},
  logout: () => {},
});

// Reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload, // IF login add user data
      };
    case "LOGOUT":
      return {
        ...state,
        user: null, // IF logout clear user data
      };
    default:
      return state;
  }
};

// AuthProvider function
const AuthProvider = (props) => {
  // create a userReducer with above authReducer and  pass in a init user state data
  const [state, dispatch] = useReducer(authReducer, initialState);

  // When trigger login function, will change AuthContext's data to type login
  function login(userData) {
    // First check user have login
    localStorage.setItem("jwtToken", userData.token);
    // If user not login, pass payload of userData
    dispatch({
      type: "LOGIN",
      payload: userData,
    });
  }

  // When trigger logout function, will change AuthContext's data to type logout
  function logout() {
    // First clean user local state
    localStorage.removeItem("jwtToken");
    // return type logout
    dispatch({
      type: "LOGOUT",
    });
  }

  return (
    <AuthContext.Provider
      value={{ user: state.user, login, logout }}
      {...props}
    />
  );
};

export { AuthContext, AuthProvider };
