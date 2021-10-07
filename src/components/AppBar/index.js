import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import bpLogo from "../../bp-logo.svg";
import { Link } from "react-router-dom";
import './index.css';

export default function ButtonAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <img src={bpLogo} alt="bp_logo" className="logo" style={{marginBottom : "10px"}}/>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
            style={{ color: "green", marginLeft: "10px", fontWeight: "bold" }}
          >
            STATUS TRACKNG PORTAL
          </Typography>
          <Button><Link to="/" style={{color: "green"}}><h6 style={{fontWeight: "bolder"}}>Summary</h6></Link></Button>
          <Button><Link to={{
              pathname: "/details",
              state: {
                selectedFlow: "",
                selectedSystem : "",
                type: "",
                batchDate: "",
                batchVersion: "",
              },
            }} style={{color: "green"}}><h6 style={{fontWeight: "bolder"}}>Details</h6></Link></Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
