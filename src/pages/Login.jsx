import React, { useState, useContext } from "react";
import { Button, Form } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { AuthContext } from "../context/auth";

import { useForm } from "../util/hooks";

const Login = (props) => {
  const context = useContext(AuthContext); // for record user login/out state
  const [errors, setErrors] = useState({}); // for record error message

  const { onChange, onSubmit, values } = useForm(login, {
    username: "",
    password: "",
  });

  // Destructure return value loginUser is function name {loading} is return value
  // useMutation(gql_context, {options})
  // {option} have a function update() will trigger when mutation do successfully
  // update(proxy, result) , proxy can read client cache metadata in the case not use so set _ , result is return value
  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    // update(proxy, result){}
    update(_, { data: { login: userData } }) {
      // Change user login state method 1
      // console.log(result); // result:{data:{login:{id, username, token ...}}}
      // context.login(result.data.login);

      // Change user login state method 2
      context.login(userData);

      props.history.push("/");
    },
    onError(error) {
      setErrors(error.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values, // what reference values pass in mutation like username etc...
  });

  function login() {
    // for prevent addUser Function be undefined error
    loginUser();
  }

  return (
    <div className="form-container">
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <h1>Login</h1>
        <Form.Input
          label="Username"
          placeholder="Username"
          name="username"
          type="text"
          value={values.username}
          error={errors.username ? true : false}
          onChange={onChange}
        />
        <Form.Input
          label="Password"
          placeholder="Password"
          name="password"
          type="password"
          value={values.password}
          error={errors.password ? true : false}
          onChange={onChange}
        />
        <Button type="submit" primary>
          Login
        </Button>
      </Form>
      {Object.keys(errors).length > 0 && (
        <div className="ui error message">
          <ul className="list">
            {Object.values(errors).map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      username
      email
      token
      createdAt
    }
  }
`;

export default Login;
