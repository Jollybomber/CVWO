import { useEffect, useState } from "react";
import Header from "../components/Header";
import { Container } from "@mui/material";

import FullPost from "../components/FullPost";
import { useCookies } from "react-cookie";

export default function PostComments() {
  const [postComments, setPostComments] = useState(null);
  const [postCookies] = useCookies(["Post"]);
  const [, setTag] = useState("");

  function fetchPosts() {
    fetch("/v1/posts/search", {
      method: "POST",
      body: JSON.stringify({
        id: postCookies.Post,
      }),
      headers: {
        accepts: "application/json",
      },
    })
      .then((res) => res.json())
      .then((response) => {
        setPostComments(response);
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => fetchPosts());

  if (!postComments) {
    return <div>Loading...</div>;
  }

  return (
    <Container disableGutters sx={{ alignContent: "center" }}>
      <Header fetchPosts={fetchPosts} setTag={setTag} />
      <FullPost post={postComments} />
    </Container>
  );
}
