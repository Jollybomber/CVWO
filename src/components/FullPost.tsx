import { post } from "../pages/Home";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import {
  AddOutlined,
  ArrowDownwardRounded,
  ArrowUpwardRounded,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import Comment from "./Comment";
import NewComment from "./NewComment";
import { useCookies } from "react-cookie";

export interface commentType {
  comment: {
    id: string;
    created_at: string;
    updated_at: string;
    username: string;
    body: string;
    post_id: string;
    user_id: string;
  };
}

export default function FullPost(props: { post: post }) {
  const [comments, setComments] = useState<commentType["comment"][] | null>(
    null
  );
  const [newComment, setNewComment] = useState(false);
  const [votes, setVotes] = useState(0);
  const [cookies] = useCookies(["User"]);

  function fetchComments() {
    fetch("/v1/posts/comments", {
      method: "POST",
      body: JSON.stringify({
        id: props.post.id,
      }),
      headers: {
        accepts: "application/json",
      },
    })
      .then((res) => res.json())
      .then((response) => {
        setComments(response);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpvote() {
    fetch("/v1/vp", {
      method: "POST",
      body: JSON.stringify({
        post_id: props.post.id,
        user_id: cookies.User,
      }),
      headers: {
        accepts: "application/json",
      },
    })
      .then((res) => res.json())
      .then(() => {
        handleVotes();
      })
      .catch((err) => console.log(err));
  }

  function handleDownvote() {
    fetch("/v1/vp", {
      method: "DELETE",
      body: JSON.stringify({
        post_id: props.post.id,
        user_id: cookies.User,
      }),
      headers: {
        accepts: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        handleVotes();
      })
      .catch((err) => console.log(err));
  }

  function handleVotes() {
    fetch("/v1/count/vp", {
      method: "POST",
      body: JSON.stringify({
        id: props.post.id,
      }),
      headers: {
        accepts: "application/json",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.error !== undefined) {
          console.log(props.post.id);
        } else {
          setVotes(json.votes);
        }
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => handleVotes());

  useEffect(() => fetchComments());

  if (!comments) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ justifyContent: "center", display: "flex", paddingTop: 10 }}>
      {newComment ? (
        <Box sx={{ postion: "absolute" }}>
          <NewComment
            setNewComment={setNewComment}
            newComment={newComment}
            post_id={props.post.id}
            fetchComments={fetchComments}
          />{" "}
        </Box>
      ) : (
        <></>
      )}
      <Stack spacing={1}>
        <Card sx={{ width: 600, boxShadow: 5 }} id={props.post.id}>
          <CardActionArea disabled>
            <CardContent>
              <Stack direction="row" spacing={30}>
                <Typography gutterBottom variant="h5" component="div">
                  {props.post.header}
                </Typography>
                <Typography
                  gutterBottom
                  variant="caption"
                  component="div"
                  fontSize={10}
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    border: 2,
                    borderColor: "primary.main",
                    p: 0.5,
                    borderRadius: 2,
                  }}
                >
                  {props.post.tag}
                </Typography>
              </Stack>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ overflowWrap: "break-word" }}
              >
                {props.post.body}
              </Typography>
            </CardContent>
          </CardActionArea>
          <CardActions sx={{ position: "relative" }}>
            <Stack direction="row" spacing={2}>
              <Button size="small" color="primary" onClick={handleUpvote}>
                <ArrowUpwardRounded />
              </Button>
              <Typography sx={{ pt: 0.7 }}> {votes} </Typography>
              <Button size="small" color="primary" onClick={handleDownvote}>
                <ArrowDownwardRounded />
              </Button>
              <Button
                size="small"
                color="primary"
                onClick={() => setNewComment(!newComment)}
              >
                <AddOutlined />
              </Button>
            </Stack>
            {/* <Link to={{ pathname: `/posts/${props.post.id}` }}> */}

            <Typography
              variant="caption"
              color="text.secondary"
              component="div"
              fontSize={9}
              sx={{ position: "absolute", bottom: 2, right: 4 }}
            >
              {`Created by: ${
                props.post.username
              } on ${props.post.created_at.slice(0, 10)}`}
            </Typography>
          </CardActions>
          <CardContent>
            <Divider flexItem />
            <Stack
              spacing={1}
              alignItems="center"
              divider={<Divider flexItem />}
            >
              {comments
                .map((com) => (
                  <Comment comment={com} fetchComments={fetchComments} />
                ))
                .reverse()}
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </div>
  );
}
