import React, { Dispatch, SetStateAction, useState } from "react";
import {
  TextField,
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

export default function EditPost(props: {
  fetchPosts(): void;
  id: string;
  header: string;
  body: string;
  setEdit: Dispatch<SetStateAction<boolean>>;
}) {
  const [title, setTitle] = useState(props.header);
  const [details, setDetails] = useState(props.body);

  const onSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();

    fetch("v1/posts", {
      method: "PATCH",
      body: JSON.stringify({
        id: props.id,
        header: title,
        body: details,
      }),
      headers: {
        accepts: "application/json",
      },
    })
      .then()
      .then(() => props.fetchPosts())
      .catch((err) => console.log(err));

    handleClose();
  };

  const handleClose = () => {
    props.setEdit(false);
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
          onSubmit: onSubmitHandler,
        }}
        maxWidth="sm"
        fullWidth
        onClose={handleClose}
      >
        <DialogTitle>Edit Post</DialogTitle>
        <DialogContent>
          <TextField
            placeholder="Title"
            required
            fullWidth
            name="title"
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setTitle(e.target.value)
            }
            value={title}
          ></TextField>
          <TextField
            multiline
            minRows={3}
            maxRows={15}
            autoFocus
            required
            margin="dense"
            id="name"
            name="body"
            placeholder="Body"
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
