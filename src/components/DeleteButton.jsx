import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { Button, Icon, Confirm } from "semantic-ui-react";

import { FETCH_POSTS_QUERY } from "../util/graphql";
import MyPopup from "../util/MyPopup";

const DeleteButton = ({ postId, commentId, callback }) => {
  const history = useHistory();
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Dynamic select mutation
  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

  const [deletePostOrComment] = useMutation(mutation, {
    update(proxy) {
      // DeletePost successfully, close confirm alert
      setConfirmOpen(false);

      // If Delete Post
      if (!commentId) {
        // remove post from client cache
        const data = proxy.readQuery({
          query: FETCH_POSTS_QUERY,
        });
        data.getPosts = data.getPosts.filter((post) => post.id !== postId);
        proxy.writeQuery({ query: FETCH_POSTS_QUERY, data });
      } // else Delete Comment, Doesn't Delete cache data

      // If Parent component send in a callback function
      if (callback) {
        callback();
      }

      // My home page getPosts get a bug, so cache refresh data not working
      if (!commentId) {
        history.push("/");
      }
    },
    variables: {
      postId,
      commentId,
    },
  });

  return (
    <>
      <MyPopup content={commentId ? "Delete comment" : "Delete post"}>
        <Button
          as="div"
          color="red"
          floated="right"
          onClick={() => setConfirmOpen(true)}
        >
          <Icon name="trash" style={{ margin: 0 }} />
        </Button>
      </MyPopup>
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePostOrComment}
      />
    </>
  );
};

const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        body
        createdAt
      }
      commentCount
    }
  }
`;

export default DeleteButton;
