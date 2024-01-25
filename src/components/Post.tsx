import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Badge, Button, CardActions, Stack, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  ArrowDownwardRounded,
  ArrowUpwardRounded,
  CommentOutlined,
  DeleteOutline,
  EditOutlined,
  MoreHorizOutlined,
} from "@mui/icons-material";

import { useCookies } from "react-cookie";
import EditPost from "./EditPost";

export interface PostProps {
  post: {
    id: string;
    created_at: string;
    updated_at: string;
    username: string;
    header: string;
    body: string;
    tag: string;
    user_id: string;
  };
  fetchPosts(): void;
}

export default function Post(props: PostProps) {
  const [show, setShow] = React.useState(true);
  const [votes, setVotes] = React.useState(0);
  const [comments, setComments] = React.useState(0);
  const [cookies] = useCookies(["User"]);
  const [, setPostCookies] = useCookies(["Post"]);
  const [edit, setEdit] = React.useState(false);
  const navigate = useNavigate();

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
      .then(() => {
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

  React.useEffect(() => handleVotes());

  function handleComments() {
    fetch("/v1/count/comments", {
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
          setComments(json.votes);
        }
      })
      .catch((err) => console.log(err));
  }

  React.useEffect(() => handleComments());

  function handleDeletePost() {
    fetch("/v1/posts", {
      method: "DELETE",
      body: JSON.stringify({
        id: props.post.id,
      }),
      headers: {
        accepts: "application/json",
      },
    })
      .then((res) => res.json())
      .then(() => {
        props.fetchPosts();
      })
      .catch((err) => console.log(err));
  }

  function handleShowEdit() {
    setEdit(true);
  }

  return (
    <Card sx={{ width: 500 }} id={props.post.id}>
      <CardContent sx={{ minHeight: 80, position: "relative" }}>
        <Typography
          sx={{ maxWidth: 400, maxHeight: 50 }}
          variant="h5"
          component="div"
          noWrap
        >
          {props.post.header}
        </Typography>
        <Stack
          direction="column"
          spacing={0.5}
          sx={{ position: "absolute", top: 10, right: 5 }}
        >
          <Typography
            gutterBottom
            variant="caption"
            component="div"
            fontSize={10}
            sx={{
              border: 2,
              borderColor: "primary.main",
              p: 0.5,
              borderRadius: 2,
              alignSelf: "center",
            }}
          >
            {props.post.tag}
          </Typography>
          {props.post.user_id === cookies.User ? (
            <Stack>
              <Tooltip title="Edit post">
                <Button onClick={handleShowEdit}>
                  <EditOutlined />
                </Button>
              </Tooltip>
              {edit && (
                <EditPost
                  id={props.post.id}
                  fetchPosts={props.fetchPosts}
                  header={props.post.header}
                  body={props.post.body}
                  setEdit={setEdit}
                />
              )}
              <Tooltip title="Delete post">
                <Button onClick={handleDeletePost}>
                  <DeleteOutline />
                </Button>
              </Tooltip>
            </Stack>
          ) : (
            <></>
          )}
        </Stack>

        <Typography
          variant="body2"
          color="text.secondary"
          noWrap={show}
          sx={{ overflowWrap: "break-word", maxWidth: 400 }}
        >
          {props.post.body}
        </Typography>
      </CardContent>

      <CardActions sx={{ position: "relative" }}>
        <Stack direction="row" spacing={2}>
          <Tooltip title="Upvote">
            <Button size="small" color="primary" onClick={handleUpvote}>
              <ArrowUpwardRounded />
            </Button>
          </Tooltip>
          <Typography sx={{ pt: 0.7 }}> {votes} </Typography>
          <Tooltip title="Downvote">
            <Button size="small" color="primary" onClick={handleDownvote}>
              <ArrowDownwardRounded />
            </Button>
          </Tooltip>
        </Stack>

        <Tooltip title="Show more">
          <Button size="small" color="primary" onClick={() => setShow(!show)}>
            <MoreHorizOutlined />
          </Button>
        </Tooltip>
        <Tooltip title="See comments">
          <Button
            size="small"
            color="primary"
            onClick={() => {
              setPostCookies("Post", props.post.id);
              navigate("/comments");
            }}
          >
            <Badge badgeContent={comments} color="primary">
              <CommentOutlined />
            </Badge>
          </Button>
        </Tooltip>
        <Typography
          variant="caption"
          color="text.secondary"
          component="div"
          fontSize={9}
          sx={{ position: "absolute", bottom: 2, right: 4 }}
        >
          {`Created by: ${props.post.username} on ${props.post.created_at.slice(
            0,
            10
          )}`}
        </Typography>
      </CardActions>
    </Card>
  );
}
