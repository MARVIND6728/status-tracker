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
    tableData: data.slice(0, 10),
    active: 1,
    start: 0,
    end: 10,
  });

  const columns = [
    { field: "headerKey", headerName: "Header key", width: 100 },
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

  const rows = data.map((item, index) => {
    item["id"] = index;
    return item;
  });

  const handleFlowChange = (event) => {
    console.log("handleFlowChange");
    const systemValue = event.target.value === "VAL_EOD" ? ["ENDUR", "EPS"] : [];
    setState({
      ...state,
      system: systemValue,
      selectedFlow: event.target.value,
    });
  };

  const searchHandler = async () => {
    const options = {
      method : "GET"
    }
    const response = await fetch("localhost:9090/bestatus?systemcd=ENDUR&flowcd=VAL_EOD&fromdate=13-AUG-2021&todate=13-AUG-2021",options);
    console.log(response)
  }

  return (
    <Container
      style={{
        /*border: "solid green 2px",*/
        padding: "50px",
      }}
    >
      <Row style={{ marginBottom: "50px" }}>
        <Col>
          <BasicSelect
            items={state.flow}
            changeHandler={handleFlowChange}
            id="flow"
            label="Flow"
            value = {state.selectedFlow}
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
            onChange={(e) => setState({ ...state, fromDate: e.target.value })}
            label="From Date"
          />
        </Col>
        <Col>
          <Date
            id="toDate"
            onChange={(e) => setState({ ...state, toDate: e.target.value })}
            label="To Date"
          />
        </Col>
        <Col>
          <Button label="Search" onClick={searchHandler}/>
        </Col>
      </Row>
      <Row>
        <DataTable columns={columns} rows={rows} checkboxSelection={false} />
      </Row>
    </Container>
  );
};

export default Summary;
