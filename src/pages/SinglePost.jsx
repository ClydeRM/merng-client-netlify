import React, { useState, useContext, useRef } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import {
  Card,
  Grid,
  Image,
  Button,
  Icon,
  Label,
  Form,
} from "semantic-ui-react";
import moment from "moment";

import { AuthContext } from "../context/auth";
import LikeButton from "../components/LikeButton";
import DeleteButton from "../components/DeleteButton";


const SinglePost = (props) => {
  const { user } = useContext(AuthContext);

  const postId = props.match.params.postId; // From url link params
  // console.log(postId);

  // comment state
  const [comment, setComment] = useState("");

  // Input init Ref
  const commentInputRef = useRef(null);

  // Same bug in Home.jsx, useQuery can't destructure data
  const { data } = useQuery(FETCH_POST_QUERY, {
    variables: { postId: postId },
  });
  const { getPost } = data || {};

  // Create comment mutation
  const [createComment] = useMutation(CREATE_COMMENT_MUTATION, {
    update() {
      setComment("");
      // Blur comment input field
      commentInputRef.current.blur();
    },
    variables: {
      postId,
      body: comment,
    },
  });

  // act DeletePost redirect to home Page
  function deletePostCallback() {
    props.history.push("/");
  }

  let postMarkup; // A dynamic Component showing postData
  if (!getPost) {
    // If Post data loading..
    postMarkup = <p>Loading post..</p>;
  } else {
    // If Post data loaded successfully
    const {
      id,
      username,
      body,
      createdAt,
      comments,
      likes,
      likeCount,
      commentCount,
    } = getPost;

    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              float="right"
              size="small"
              src="https://react.semantic-ui.com/images/avatar/large/molly.png"
            />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton user={user} post={{ id, likeCount, likes }} />
                <Button
                  as="div"
                  labelPosition="right"
                >
                  <Button basic color="blue">
                    <Icon name="comments" />
                  </Button>
                  <Label basic color="blue" pointing="left">
                    {commentCount}
                  </Label>
                </Button>
                {user && user.username === username && (
                  <DeleteButton postId={id} callback={deletePostCallback} />
                )}
              </Card.Content>
            </Card>
            {user && ( // If user is login, showing AddComment form
              <Card fluid>
                <Card.Content>
                  <p>Post a comment</p>
                  <Form>
                    <div className="ui action input fluid">
                      <input
                        type="text"
                        placeholder="Comment..."
                        name="comment"
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                        ref={commentInputRef} // After submit, input must be unactived 
                      ></input>
                      <button
                        type="submit"
                        className="ui button teal"
                        disable={comment.trim() === ""}
                        onClick={createComment}
                      >
                        Submit
                      </button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}
            {comments.map(
              (
                comment // showing comment card
              ) => (
                <Card fluid key={comment.id}>
                  <Card.Content>
                    {user && user.username === comment.username && (
                      <DeleteButton postId={id} commentId={comment.id} />
                    )}
                    <Card.Header>{comment.username}</Card.Header>
                    <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                    <Card.Description>{comment.body}</Card.Description>,
                  </Card.Content>
                </Card>
              )
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  return postMarkup;
};

const FETCH_POST_QUERY = gql`
  query getPost($postId: ID!) {
    getPost(postId: $postId) {
      id
      username
      body
      createdAt
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        body
        createdAt
      }
    }
  }
`;

const CREATE_COMMENT_MUTATION = gql`
  mutation createComment($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
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

export default SinglePost;
