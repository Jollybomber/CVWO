import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

export default function NewComment(props: {
  setNewComment: React.Dispatch<React.SetStateAction<boolean>>;
  newComment: boolean;
  post_id: string;
  fetchComments(): void;
}) {
  const [details, setDetails] = useState("");
  const [cookies] = useCookies(["API"]);
  const [usernameCookies] = useCookies(["Username"]);
  const [postCookies] = useCookies(["Post"]);
  const [userCookies] = useCookies(["User"]);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();

    fetch("/v1/comments", {
      method: "POST",
      body: JSON.stringify({
        username: usernameCookies.Username,
        body: details,
        post_id: postCookies.Post,
        user_id: userCookies.User,
      }),
      headers: {
        accepts: "application/json",
        Authorization: `ApiKey ${cookies.API}`,
      },
    })
      .then((res) => res.json())
      .then(() => {
        props.fetchComments();
      })
      .catch((err) => console.log(err));

    handleClose();
  };

  function handleOpen() {
    if (props.newComment) {
      setDetails("");
    }
  }
  useEffect(handleOpen);

  const handleClose = () => {
    props.setNewComment(false);
  };

  return (
    <Box
      alignContent="center"
      alignSelf="stretch"
      sx={{
        bgcolor: "primary",
        border: "1",
        borderColor: "secondary",
        borderRadius: "2",
      }}
    >
      <Dialog
        open
        PaperProps={{
          component: "form",
          onSubmit: handleSubmitComment,
        }}
        maxWidth="sm"
        fullWidth
        onClose={handleClose}
      >
        <DialogTitle>Add Comment</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            minRows={3}
            maxRows={15}
            autoFocus
            required
            margin="dense"
            id="name"
            name="body"
            placeholder="Write your comment here..."
            fullWidth
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setDetails(e.target.value)
            }
            value={details}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Post</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
