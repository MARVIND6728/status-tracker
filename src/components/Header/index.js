import React from "react";
import "./header.css";
import bpLogo from "../../bp-logo.svg";
const Header = () => {
  return (
    <div class="header">
      <img src={bpLogo} alt="bp_logo" className ="logo"/>
      <div class="header-right">
         <h3>STATUS TRACKING PORTAL</h3>
      </div>
    </div>
  );
};

export default Header;
