import React from "react";
import "./App.css";
import Header from "./components/Header";
import Details from "./components/Details";
import Summary from "./components/Summary";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

function App() {
  return (
    <div>
      <Header />
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Details</Link>
              </li>
              <li>
                <Link to="/summary">Summary</Link>
              </li>
            </ul>
          </nav>

          <Switch>
            <Route exact path="/">
              <Details />
            </Route>
            <Route path="/summary">
              <Summary />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
