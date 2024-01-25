import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useState } from "react";

export default function EditComment(props: {
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
  details: string;
  id: string;
  fetchComments(): void;
}) {
  const [details, setDetails] = useState(props.details);

  const onSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();

    fetch("v1/comments", {
      method: "PATCH",
      body: JSON.stringify({
        id: props.id,
        body: details,
      }),
      headers: {
        accepts: "application/json",
      },
    })
      .then((res) => res.json())
      .then(() => props.fetchComments())
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
        <DialogTitle>Edit Comment</DialogTitle>
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
