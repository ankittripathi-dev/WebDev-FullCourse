import React from "react";
import "@fontsource/roboto";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import Alert from "@mui/material/Alert";

const App = () => {
  const handleClick = () => {
    alert("clicked on Button");
  };

  return (
    <>
      <h1 style={{ fontFamily: "Roboto" }}>Material UI Demo</h1>
      <div>
        <h1>Basic button</h1>
        <Button variant="text" onClick={handleClick}>
          Click me!
        </Button>
        &nbsp;&nbsp;
        <Button variant="contained" onClick={handleClick}>
          Contained
        </Button>
        &nbsp;&nbsp;
        <Button variant="outlined" onClick={handleClick}>
          Outlined
        </Button>
      </div>

      <div>
        <h1>Outlined button</h1>
        <Button disabled onClick={handleClick}>
          Disabled
        </Button>
      </div>

      <div>
        <h1>Color</h1>
        <Button variant="contained" color="success">
          Success
        </Button>
        &nbsp;&nbsp;
        <Button variant="outlined" color="error">
          Error
        </Button>
        &nbsp;&nbsp;
        <Button variant="contained" color="error">
          Error
        </Button>
      </div>

      <div>
        <h1>Sizes</h1>
        <Button variant="contained" size="small">
          Small
        </Button>
        &nbsp;&nbsp;
        <Button variant="contained" size="medium" color="success">
          Medium
        </Button>
        &nbsp;&nbsp;
        <Button variant="contained" size="large" color="error">
          Large
        </Button>
      </div>

      <div>
        <h1>Icons</h1>
        <Button variant="contained" startIcon={<DeleteIcon />}>
          Delete
        </Button>
        &nbsp;&nbsp;
        <Button variant="contained" endIcon={<SendIcon />}>
          Send
        </Button>
        &nbsp;&nbsp;
        <Button
          color="success"
          aria-label="add to shopping cart"
          variant="contained"
        >
          <AddShoppingCartIcon />
        </Button>
      </div>

      <div>
        <h1>Alert</h1>
        <Alert severity="success">
          Confirmation that your action was successful.
        </Alert>

        <Alert severity="error">Delete option is given!</Alert>

        <Alert severity="warning">Something went wrong?</Alert>
      </div>
    </>
  );
};

export default App;
