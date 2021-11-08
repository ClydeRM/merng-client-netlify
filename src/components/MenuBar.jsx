import React, { useContext, useState } from "react";
import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";

import { AuthContext } from "../context/auth";

const MenuBar = () => {
  
  const { user, logout } = useContext(AuthContext);
  // from web api to get url link
  const pathname = window.location.pathname;

  // Value path is making for MenuBar to highline the true tag with which path right now
  const path = pathname === "/" ? "home" : pathname.substr(1); // substr for url ex google.com/substr(1)/substr(2) ...
  const [activeItem, setActiveItem] = useState(path);

  const handleItemClick = (e, { name }) => setActiveItem(name);


  const menuBar = user ? (
    // If user is login
    <Menu pointing secondary size="massive" color="teal">
      <Menu.Item
        name={user.username} // Show username as home btn
        active // Set not always active
        as={Link} // Make this component as a Link Component and pass a props to Link
        to="/" // Link component direct to which page?
      />
      <Menu.Menu position="right">
        <Menu.Item
          name="logout"
          onClick={logout} // Trigger logout function
        />
      </Menu.Menu>
    </Menu>
  ) : (
    // If user is logout
    <Menu pointing secondary size="massive" color="teal">
      <Menu.Item
        name="home"
        active={activeItem === "home"}
        onClick={handleItemClick}
        as={Link} // Make this component as a Link Component and pass a props to Link
        to="/" // Link component direct to which page?
      />
      <Menu.Menu position="right">
        <Menu.Item
          name="login"
          active={activeItem === "login"}
          onClick={handleItemClick}
          as={Link} // Make this component as a Link Component and pass a props to Link
          to="/login"
        />
        <Menu.Item
          name="register"
          active={activeItem === "register"}
          onClick={handleItemClick}
          as={Link} // Make this component as a Link Component and pass a props to Link
          to="/register"
        />
      </Menu.Menu>
    </Menu>
  );

  return menuBar;
};

export default MenuBar;
