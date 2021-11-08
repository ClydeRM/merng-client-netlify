import React from "react";
import { useHistory } from "react-router-dom";
import { Button, Form } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

import { useForm } from "../util/hooks";
import { FETCH_POSTS_QUERY } from "../util/graphql";

const PostForm = () => {
  const history = useHistory();
  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    body: "",
  });
  // Destructure return value createPostCallback is function name
  // {error} is return value handle error message, Not like Login mutation createPost only have one error message, so we don't want complex code
  // useMutation(gql_context, {options})
  // {option} have a function update() will trigger when mutation do successfully
  // update(proxy, result) , proxy can read client cache metadata, result is return value
  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values, // PostForm body
    update(proxy, result) {
      const data = proxy.readQuery({
        // Get all of Posts data from cache,
        query: FETCH_POSTS_QUERY,
      });

      data.getPosts = [result.data.createPost, ...data.getPosts]; // Merging new Post in Cache Posts data array
      proxy.writeQuery({ query: FETCH_POSTS_QUERY, data }); // Write new Posts data in client cache
      values.body = ""; // Reset PostForm body to empty string

      // My home page getPosts get a bug, so cache refresh data not working
      history.push("/");
    },
  });

  function createPostCallback() {
    createPost();
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>Create a post:</h2>
        <Form.Field>
          <Form.Input
            placeholder="Hi World!"
            name="body"
            onChange={onChange}
            value={values.body}
            error={error ? true : false}
          />
          <Button type="submit" color="teal">
            Submit
          </Button>
        </Form.Field>
      </Form>
      {error && (
        <div className="ui error message" style={{marginBottom: 20}}>
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  );
};

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      username
      body
      createdAt
      likeCount
      likes {
        id
        username
      }
      commentCount
      comments {
        id
        username
        body
      }
    }
  }
`;

export default PostForm;
