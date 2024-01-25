import { useEffect, useState } from "react";
import Header from "../components/Header";
import { Container } from "@mui/material";
import PostList from "../components/PostList";

export interface post {
  id: string;
  created_at: string;
  updated_at: string;
  username: string;
  header: string;
  body: string;
  tag: string;
  user_id: string;
}

export interface postProps {
  fetchPosts(): void;
}

export default function Home() {
  const [posts, setPosts] = useState<post[]>([]);
  const [tag, setTag] = useState("All");

  function fetchPosts() {
    fetch("/v1/posts")
      .then((res) => res.json())
      .then((response) => {
        setPosts(response.reverse());
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => fetchPosts(), []);

  return (
    <Container disableGutters>
      <Header fetchPosts={fetchPosts} setTag={setTag} />
      <PostList tag={tag} posts={posts} fetchPosts={fetchPosts} />
    </Container>
  );
}
