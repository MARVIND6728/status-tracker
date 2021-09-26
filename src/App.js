import React, { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Select from "./components/Select";
import { Button, Container, Row, Col, Table, Pagination} from "react-bootstrap";

import data from './data.json';

function App() {

  let items = [];
  let paginationCount = Math.ceil(data.length/5);
  const [state, setState] = useState({
    flow: ["VAL_ID", "VAL_EOD"],
    system: [],
    tableData : data.slice(0,5),
    active : 1,
    start : 0,
    end : 5
  });

  const handlePagination = (number) => {
    
     const start = number*5 -5;
     const end = number*5 > data.length ? data.length : number * 5;;
     const tableData = data.slice(start,end);

     setState({...state, start: start, end:end, tableData : tableData,active : number})
  }

  for (let number = 1; number <= paginationCount; number++) {
    items.push(
      <Pagination.Item key={number} active={state.active === number} onClick={() => handlePagination(number)}>
        {number}
      </Pagination.Item>,
    );
  }

  

  const handleD1 = (event) => {
     const systemValue = event.target.value === "VAL_EOD" ? ["ENDUR" , "EPS"] :  [] ;
     setState({...state, system : systemValue});
  };

  const handleD2 = (event) => {
  };

  return (
    <div>
      <Header />
      
      <Container style = {{ border : "solid green 2px", padding : "50px", marginBottom : "50px"}}>
       
        <Row style={{ marginBottom: "50px" }}>
          <Col>
            Flow &nbsp;&nbsp;&nbsp;{" "}
            <Select items={state.flow} changeHandler={handleD1} id="flow" />
          </Col>
          <Col>
           System &nbsp;&nbsp;&nbsp;
            <Select
              items={state.system}
              changeHandler={handleD2}
              id="system"
            />
          </Col>
          <Col>
            To Date &nbsp;&nbsp;&nbsp; <input type="date" id="toDate" />
          </Col>
          <Col>
            From Date &nbsp;&nbsp;&nbsp;
            <input type="date" id="fromDate" />
          </Col>
        </Row>
        <Row  style={{ marginBottom: "75px", textAlign : "center"}}>
          <Col>
            <Button variant="success">Search</Button>
          </Col>
        </Row>
        <Row>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Source Batch Date</th>
                <th>Source Batch Number</th>
                <th>Batch Version</th>
                <th>Source Run DTM</th>
                <th>Controller Status Code</th>
                <th>Total Type Count</th>
                <th>Total Type Processed</th>
                <th>Batch Count</th>
                <th>Publish Status</th>
                <th>Target Status</th>
              </tr>
            </thead>
            <tbody>
              { state.tableData && state.tableData.map( item => {
                 return (
                   <tr key= {item.batchVersion}>
                     <td>{item.sourceBatchDate}</td>
                     <td>{item.sourceBatchNumber}</td>
                     <td>{item.batchVersion}</td>
                     <td>{item.sourceRunDtm}</td>
                     <td>{item.controllerStatusCode}</td>
                     <td>{item.totalTypeCount}</td>
                     <td>{item.totalTypeProcessed}</td>
                     <td>{item.batchCount}</td>
                     <td>{item.publishStatus}</td>
                     <td>{item.targetStatus}</td>
                   </tr>
                 )
              })}
            </tbody>
          </Table>
          <Pagination>{items}</Pagination>
        </Row>
      </Container>
    </div>
  );
}

export default App;
