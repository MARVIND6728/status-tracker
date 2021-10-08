import React from "react";
import "./App.css";
import Details from "./components/Details";
import Summary from "./components/Summary";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import AppBar from "./components/AppBar";
function App() {
  return (
    <div>
      <Router>
        <AppBar />
        <Row className="rowClass">
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
