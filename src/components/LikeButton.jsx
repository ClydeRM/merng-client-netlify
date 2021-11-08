import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Button, Icon, Label } from "semantic-ui-react";

import MyPopup from "../util/MyPopup";

const LikeButton = ({ user, post: { id, likes, likeCount } }) => {
  // Default state
  const [liked, setLiked] = useState(false);

  // If user login, Detect user have likePost?, and change state
  useEffect(() => {
    if (user && likes.find((like) => like.username === user.username)) {
      // user login and have liked this post
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [user, likes]);

  // Send Mutation
  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id },
  });

  // Button animation
  const likeButton = user ? (
    // user login
    liked ? (
      // Have liked this post, show full box
      <Button color="teal">
        <Icon name="heart" />
      </Button>
    ) : (
      // Haven't liked this post, show basic box
      <Button color="teal" basic>
        <Icon name="heart" />
      </Button>
    )
  ) : (
    // User not login, button as a link to login page
    <Button as={Link} to="/login" color="teal" basic>
      <Icon name="heart" />
    </Button>
  );

  return (
    <MyPopup content={liked ? 'Unlike' : 'Like'}>
      <Button as="div" labelPosition="right" onClick={likePost}>
        {likeButton}
        <Label basic color="teal" pointing="left">
          {likeCount}
        </Label>
      </Button>
    </MyPopup>
  );
};

const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
        username
      }
      likeCount
    }
  }
`;

export default LikeButton;
