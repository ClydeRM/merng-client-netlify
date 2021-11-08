import React, { useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import { Grid, Transition } from "semantic-ui-react";

import { AuthContext } from "../context/auth";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import { FETCH_POSTS_QUERY } from "../util/graphql";

const Home = () => {
  // Get login user
  const { user } = useContext(AuthContext);

  // Fetch all Posts data
  // destructure the data to only get Posts data array object
  // const { loading, data:{getPosts: posts} } = useQuery(FETCH_POSTS_QUERY); //getError getPosts undefined?
  const { loading, data } = useQuery(FETCH_POSTS_QUERY);
  const { getPosts: posts } = data || {};

  return (
    <Grid columns={3}>
      <Grid.Row className="page-title">
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {user && ( // If user login, showing AddPost form
          <Grid.Column>
            <PostForm />
          </Grid.Column>
        )}
        {loading ? ( // Posts data field
          // If data is loading
          <h1>Loading posts..</h1>
        ) : (
          // If data is loading successfully, with transition animate
          <Transition.Group> 
            {posts &&
              posts.map((post) => (
                <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
                  <PostCard post={post} />
                </Grid.Column>
              ))}
          </Transition.Group>
        )}
      </Grid.Row>
    </Grid>
  );
};

export default Home;
