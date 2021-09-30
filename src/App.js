import React from "react";
import "./App.css";
import Header from "./components/Header";
import Details from "./components/Details";
import Summary from "./components/Summary";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import AppBar from './components/AppBar';
function App() {
  return (
    <div>
     
      {/* <Header /> */}

      <Router>
      <AppBar />
        <Row>
          {/* <Col lg={2}>
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
          </Col> */}
          <Col>
            <div>
              <Switch>
                <Route exact path="/">
                  <Summary />
                </Route>
                <Route path="/details">
                  <Details />
                </Route>
              </Switch>
            </div>
          </Col>
        </Row>
      </Router>
    </div>
  );
}

export default App;
