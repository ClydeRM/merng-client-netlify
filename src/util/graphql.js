import gql from "graphql-tag";

export const FETCH_POSTS_QUERY = gql`
  query getPosts {
    getPosts {
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
