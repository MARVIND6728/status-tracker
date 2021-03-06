import React, { useState } from "react";
import BasicSelect from "../Select";
import Date from "../Date";
import { Container, Row, Col } from "react-bootstrap";
import data from "../../data.json";
import { Link } from "react-router-dom";
import Button from "../Button";
import DataTable from "../DataTable";

const Summary = () => {
  const [state, setState] = useState({
    flow: ["VAL_ID", "VAL_EOD"],
    system: [],
    rows : null
  });

  const columns = [
    { field: "headerKey", headerName: "HDR key", width: 100 },
    { field: "batchDate", headerName: "Batch Date", width: 170 },
    { field: "batchNumber", headerName: "Batch Number", width: 120 },
    { field: "batchVersion", headerName: "Batch Version", width: 115 },
    { field: "sourceRunDate", headerName: "Source Run Date", width: 170 },
    { field: "controllerStatus", headerName: "Controller Status", width: 145 },
    { field: "batchCount", headerName: "Batch Count", width: 110 },
    {
      field: "publisherStatus",
      headerName: "Publisher Status",
      width: 140,
      renderCell: (params) => {
        return (
          <Link
            to={{
              pathname: "/details",
              state: {
                ...state,
                type: "Publisher Status",
                headerKey : params.row.headerKey,
                batchDate: params.row.batchDate,
                batchVersion: params.row.batchVersion,
              },
            }}
          >
            {params.value}
          </Link>
        );
      },
    },
    {
      field: "subscriberStatus",
      headerName: "Subscriber Status",
      width: 140,
      renderCell: (params) => {
        return (
          <Link
            to={{
              pathname: "/details",
              state: {
                ...state,
                type: "Subscriber Status",
                headerKey : params.row.headerKey,
                batchDate: params.row.batchDate,
                batchVersion: params.row.batchVersion,
              },
            }}
          >
            {params.value}
          </Link>
        );
      },
    },
  ];

  const handleFlowChange = (event) => {
    console.log("handleFlowChange");
    const systemValue =
      event.target.value === "VAL_EOD" ? ["ENDUR", "EPS"] : [];
    setState({
      ...state,
      system: systemValue,
      selectedFlow: event.target.value,
      selectedSystem : ''
    });
  };

  const searchHandler = async () => {
    
    const options = {
      method: "GET",
      "Content-Type": 'application/json',
      "Accept": 'application/json'
    };

    const url = `/bestatus?systemcd=${state.selectedSystem || ''}&flowcd=${state.selectedFlow || ''}&fromdate=${state.fromDate || ''}&todate=${state.toDate || ''}`;
    console.log(url);
    const response = await fetch( url, options);
    console.log(response)
    const data = await response.json();
    console.log("inside",data)
    let rows = null;
    if( typeof(data) === 'object'){ 
       rows = data.map((item, index) => {
        item["id"] = index;
        return item;
      });
    }
    setState({...state,rows:rows})

  };

  return (
    <Container
      style={{
        /*border: "solid green 2px",*/
        padding: "50px",
      }}
    >
      <Row style={{textAlign:"center", color : "green",marginBottom: "50px"}}><h3>BATCH SUMMARY</h3></Row>
      <Row style={{ marginBottom: "50px" }}>
        <Col>
          <BasicSelect
            items={state.flow}
            changeHandler={handleFlowChange}
            id="flow"
            label="Flow"
            value={state.selectedFlow}
          />
        </Col>
        <Col>
          <BasicSelect
            label="System"
            items={state.system}
            changeHandler={(e) =>
              setState({ ...state, selectedSystem: e.target.value })
            }
            id="system"
          />
        </Col>
        <Col>
          <Date
            id="fromDate"
            onChange={(date) => { 
              setState({ ...state, fromDate: date }) }}
            label="From Date"
          />
        </Col>
        <Col>
          <Date
            id="toDate"
            onChange={(date) => { 
              setState({ ...state, toDate: date }) }}
            label="To Date"
          />
        </Col>
        <Col>
          <Button label="Search" onClick={searchHandler} />
        </Col>
      </Row>
      <Row>
        { state.rows && (state.rows.length !=0 ? <DataTable columns={columns} rows={state.rows} checkboxSelection={false} /> : <h1>No Data Found</h1>)}
      </Row>
    </Container>
  );
};

export default Summary;
