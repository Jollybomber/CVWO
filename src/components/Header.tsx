import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import HomeIcon from "@mui/icons-material/Home";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import NewPost from "./NewPost";
import { useNavigate } from "react-router";
import { useCookies } from "react-cookie";

const tags = ["All", "General", "Gaming", "Funny", "Lifestyle"];

function Header(props: {
  fetchPosts(): void;
  setTag: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const [alert, setAlert] = React.useState(false);
  const [cookies] = useCookies(["User"]);
  const [api] = useCookies(["API"]);
  const navigate = useNavigate();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
    props.fetchPosts();
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleClose = () => {
    setAlert(false);
  };

  function deleteUser() {
    fetch("/v1/users", {
      method: "DELETE",
      body: JSON.stringify({
        id: cookies.User,
      }),
      headers: {
        accepts: "application/json",
        Authorization: `ApiKey ${api.API}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => console.log(err));

    navigate("/");
  }

  return (
    <AppBar position="static">
      <Container>
        <Dialog
          open={alert}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Are you sure?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              You are about to delete your account and all posts and comments
              associated with you. This action is irreversible.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={deleteUser} autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <Toolbar disableGutters>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "flex", md: "flex" },
            }}
          >
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "block" },
              }}
            >
              {tags.map((page) => (
                <MenuItem
                  key={page}
                  onClick={() => {
                    props.setTag(page);
                    handleCloseNavMenu();
                  }}
                  value={page}
                >
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <HomeIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/home"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".1rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            CVWO
          </Typography>
          <HomeIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />

          <Box sx={{ m: 1 }}>
            <NewPost fetchPosts={props.fetchPosts} />
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem key="Logout" onClick={() => navigate("/")}>
                <Typography textAlign="center">Logout</Typography>
              </MenuItem>
              <MenuItem key="Delete" onClick={() => setAlert(true)}>
                <Typography textAlign="center">Delete</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
