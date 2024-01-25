import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
  Fab,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";

import { Add } from "@mui/icons-material";
import { postProps } from "../pages/Home";
import { useCookies } from "react-cookie";

export default function NewPost(props: postProps) {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [open, setOpen] = useState(false);
  const [cookies] = useCookies(["API"]);
  const [userCookies] = useCookies(["Username"]);
  const tags = ["General", "Gaming", "Funny", "Lifestyle"];
  const [tag, setTag] = useState("General");

  const onSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();

    fetch("v1/posts", {
      method: "POST",
      body: JSON.stringify({
        username: userCookies.Username,
        header: title,
        body: details,
        tag: tag,
      }),
      headers: {
        accepts: "application/json",
        Authorization: `ApiKey ${cookies.API}`,
      },
    })
      .then((res) => res.json())
      .then(() => props.fetchPosts())
      .catch((err) => console.log(err));

    handleClose();
  };

  const handleClickOpen = () => {
    setOpen(true);
    setTitle("");
    setDetails("");
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelect = (event: SelectChangeEvent) => {
    setTag(event.target.value);
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
      <Tooltip title="Create new post">
        <Fab
          size="small"
          color="primary"
          aria-label="add"
          sx={{ boxShadow: 0, mr: 1 }}
          onClick={handleClickOpen}
        >
          <Add></Add>
        </Fab>
      </Tooltip>
      <Dialog
        open={open}
        PaperProps={{
          component: "form",
          onSubmit: onSubmitHandler,
        }}
        maxWidth="sm"
        fullWidth
        onClose={handleClose}
      >
        <DialogTitle>New Post</DialogTitle>
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
          <FormControl
            sx={{ width: 300, position: "absolute", left: 25, bottom: 10 }}
          >
            <InputLabel>Tag</InputLabel>
            <Select label="Tag" onChange={handleSelect} defaultValue="General">
              {tags.map((tag) => (
                <MenuItem value={tag}>{tag}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Post</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
