import {
  ArrowDownwardRounded,
  ArrowUpwardRounded,
  DeleteOutline,
  EditOutlined,
} from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import EditComment from "./EditComment";

interface commentProp {
  comment: {
    id: string;
    created_at: string;
    updated_at: string;
    username: string;
    body: string;
    post_id: string;
    user_id: string;
  };
  fetchComments(): void;
}

export default function Comment(props: commentProp) {
  const [votes, setVotes] = useState(0);
  const [userCookies] = useCookies(["User"]);
  const [edit, setEdit] = useState(false);

  function handleUpvote() {
    fetch("/v1/vc", {
      method: "POST",
      body: JSON.stringify({
        comment_id: props.comment.id,
        user_id: userCookies.User,
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
    fetch("/v1/vc", {
      method: "DELETE",
      body: JSON.stringify({
        comment_id: props.comment.id,
        user_id: userCookies.User,
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
    fetch("/v1/count/vc", {
      method: "POST",
      body: JSON.stringify({
        id: props.comment.id,
      }),
      headers: {
        accepts: "application/json",
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.error !== undefined) {
        } else {
          setVotes(json.votes);
        }
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => handleVotes());
  function handleDelete() {
    fetch("/v1/comments", {
      method: "DELETE",
      body: JSON.stringify({
        id: props.comment.id,
      }),
      headers: {
        accepts: "application/json",
      },
    })
      .then((res) => res.json())
      .then(() => {
        props.fetchComments();
      })
      .catch((err) => console.log(err));
  }

  const handleEdit = () => {
    setEdit(true);
  };

  return (
    <Card
      sx={{ width: 500, boxShadow: 0, position: "relative" }}
      id={props.comment.id}
    >
      <CardContent sx={{ minHeight: 40 }}>
        {edit && (
          <EditComment
            fetchComments={props.fetchComments}
            id={props.comment.id}
            details={props.comment.body}
            setEdit={setEdit}
          />
        )}
        {userCookies.User === props.comment.user_id ? (
          <Stack sx={{ position: "absolute", top: 5, right: 0 }}>
            <Tooltip title="Edit comment">
              <Button onClick={handleEdit}>
                <EditOutlined />
              </Button>
            </Tooltip>
            <Tooltip title="Delete comment">
              <Button onClick={handleDelete}>
                <DeleteOutline />
              </Button>
            </Tooltip>
          </Stack>
        ) : (
          <></>
        )}

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ overflowWrap: "break-word" }}
        >
          {props.comment.body}
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
        {/* <Link to={{ pathname: `/posts/${props.post.id}` }}> */}

        <Typography
          variant="caption"
          color="text.secondary"
          component="div"
          fontSize={9}
          sx={{ position: "absolute", bottom: 2, right: 4 }}
        >
          {`Commented by: ${
            props.comment.username
          } on ${props.comment.created_at.slice(0, 10)}`}
        </Typography>
      </CardActions>
    </Card>
  );
}
