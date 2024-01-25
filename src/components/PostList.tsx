import { Pagination, Stack } from "@mui/material";
import React, { useState } from "react";
import Post from "./Post";
import { post } from "../pages/Home";

function PostList(props: { posts: post[]; fetchPosts(): void; tag: string }) {
  const [page, setPage] = useState(1);

  function handlePage(event: React.ChangeEvent<unknown>, value: number) {
    setPage(value);
  }

  function filterPosts(posts: post[]): post[] {
    if (props.tag === "All") {
      return posts;
    } else {
      return posts.filter((each) => each.tag === props.tag);
    }
  }

  const filtered = filterPosts(props.posts);
  const rangeLower = 10 * (page - 1) + 0;
  const rangeUpper = 10 * (page - 1) + 10;
  return (
    <Stack alignItems="center" justifyContent="center" spacing={2} margin={5}>
      <Pagination
        count={Math.ceil(props.posts.length / 10)}
        page={page}
        onChange={handlePage}
        showFirstButton
        showLastButton
      />
      {filtered.slice(rangeLower, rangeUpper).map((post) => (
        <Post post={post} key={post.id} fetchPosts={props.fetchPosts} />
      ))}
      <Pagination
        count={Math.ceil(props.posts.length / 10)}
        page={page}
        onChange={handlePage}
        showFirstButton
        showLastButton
      />
    </Stack>
  );
}

export default PostList;
