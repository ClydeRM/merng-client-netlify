import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";

import { AuthContext } from "../context/auth";

// Prevent user route to login/register page when user is login

const AuthRoute = ({ component: Component, ...rest }) => {
  const { user } = useContext(AuthContext);

  return (
    <Route
      {...rest} // seems like props, html tag's setting
      render={
        // Check user is login and  route to Login/Register page
        (props) =>
          user ? (
            <Redirect to="/" /> // If user is login
          ) : (
            <Component {...props} />
          ) // If user is not login, render the component that user route in
      }
    />
  );
};

export default AuthRoute;
