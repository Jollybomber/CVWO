import React, { Dispatch, SetStateAction, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  AlertTitle,
} from "@mui/material";

import { HowToRegOutlined, LoginOutlined } from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

interface loginProps {
  login: boolean;
  setLogin: Dispatch<SetStateAction<boolean>>;
}

function LoginPage(props: loginProps) {
  const [isSignup, setIsSignup] = useState(false);
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();
  const [, setCookies] = useCookies(["API"]);
  const [, setUserCookies] = useCookies(["User"]);
  const [, setUsernameCookies] = useCookies(["Username"]);
  const [alert, setAlert] = useState(false);

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  function handleClose() {
    setAlert(false);
  }

  function handleLogin(api: string) {
    fetch("v1/users", {
      method: "GET",
      headers: {
        accepts: "application/json",
        Authorization: "ApiKey " + api,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.error !== undefined) {
          setIsError(true);
          setAlert(true);
        } else {
          props.setLogin(true);
          setIsError(false);
          setAlert(false);
          setCookies("API", json.api_key);
          setUserCookies("User", json.id);
          setUsernameCookies("Username", json.username);
          navigate("/home");
        }
      })
      .catch((err) => console.log(err));
  }

  function handleSubmit(e: React.ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    setInputs({ username: "", password: "" });

    isSignup
      ? fetch("v1/users", {
          method: "POST",
          body: JSON.stringify({
            username: inputs.username,
            password: inputs.password,
          }),
          headers: {
            accepts: "application/json",
          },
        })
          .then((res) => res.json())
          .then((json) => {
            if (json.error !== undefined) {
              setIsError(true);
              setAlert(true);
            } else {
              setIsError(false);
              setAlert(true);
              setIsSignup(false);
            }
          })
          .catch((err) => {
            console.log(err);
          })
      : fetch("v1/users/login", {
          method: "POST",
          body: JSON.stringify({
            username: inputs.username,
            password: inputs.password,
          }),
          headers: {
            accepts: "application/json",
          },
        })
          .then((res) => res.json())
          .then((json) => handleLogin(json))
          .catch((err) => console.log(err));
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Box
          display="flex"
          flexDirection={"column"}
          maxWidth={400}
          alignItems="center"
          justifyContent="center"
          margin="auto"
          marginTop={5}
          padding={5}
          borderRadius={5}
          boxShadow={"5px 5px 10px #ccc"}
          sx={{
            ":hover": {
              boxShadow: "10px 10px 20px #ccc",
            },
          }}
        >
          {alert ? (
            <Alert
              severity={isError ? "error" : "success"}
              onClose={() => {
                handleClose();
              }}
            >
              <AlertTitle>
                {!isError
                  ? "You were successful in signing up, please log in."
                  : isSignup
                  ? "This username is already taken."
                  : "Invalid login details"}
              </AlertTitle>
            </Alert>
          ) : (
            <></>
          )}
          <Typography variant="h4" padding={3} textAlign="center">
            {isSignup ? "Signup" : "Login"}
          </Typography>
          <TextField
            value={inputs.username}
            name="username"
            margin="normal"
            type={"Username"}
            variant="outlined"
            placeholder="Username"
            onChange={handleInput}
            error={isError}
            helperText={isError ? "Incorrect entry." : ""}
          />
          <TextField
            value={inputs.password}
            name="password"
            margin="normal"
            type={"password"}
            variant="outlined"
            placeholder="Password"
            onChange={handleInput}
            error={isError}
            helperText={isError ? "Incorrect entry." : ""}
          />
          <Button
            type="submit"
            sx={{ marginTop: 3, borderRadius: 3 }}
            variant="contained"
            color="warning"
            endIcon={isSignup ? <HowToRegOutlined /> : <LoginOutlined />}
          >
            {isSignup ? "Signup" : "Login"}
          </Button>
          <Button
            onClick={() => setIsSignup(!isSignup)}
            sx={{ marginTop: 3, borderRadius: 3 }}
          >
            {isSignup
              ? "Already have an account? Login here!"
              : "Not yet registered? Sign up here!"}
          </Button>
        </Box>
      </form>
    </div>
  );
}

export default LoginPage;
