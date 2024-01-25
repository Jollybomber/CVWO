import { useState } from "react";

import { Container } from "@mui/system";
import { ThemeProvider, createTheme } from "@mui/material";
import { blue } from "@mui/material/colors";
import LoginPage from "./pages/LoginPage";

import Home from "./pages/Home";

import { Route, Routes } from "react-router-dom";
import PostComments from "./pages/PostComments";
import { CookiesProvider } from "react-cookie";

declare module "@mui/material/styles" {
  interface Theme {
    status: {
      danger: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}

const theme = createTheme({
  palette: {
    primary: blue,
  },
});

function App() {
  const [login, setLogin] = useState(false);

  return (
    <CookiesProvider>
      <ThemeProvider theme={theme}>
        <Container className="App" disableGutters>
          <Routes>
            <Route path="/comments" element={<PostComments />} />
            <Route path="/home" element={<Home />} />
            <Route
              path="/"
              element={<LoginPage login={login} setLogin={setLogin} />}
            />
          </Routes>
        </Container>
      </ThemeProvider>
    </CookiesProvider>
  );
}

export default App;
