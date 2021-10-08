import React, { useState } from "react";
import BasicSelect from "../Select";
import Date from "../Date";
import { Container, Row, Col, Table, Pagination } from "react-bootstrap";
import data from "../../data.json";
import { Link } from "react-router-dom";
import Button from "../Button";
import DataTable from "../DataTable";

const Summary = () => {
  const [state, setState] = useState({
    flow: ["VAL_ID", "VAL_EOD"],
    system: [""],
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

  let items = [];
  let paginationCount = Math.ceil(data.length / 10);

  const handlePagination = (number) => {
    const start = number * 10 - 10;
    const end = number * 10 > data.length ? data.length : number * 10;
    const tableData = data.slice(start, end);

    setState({
      ...state,
      start: start,
      end: end,
      tableData: tableData,
      active: number,
    });
  };

  for (let number = 1; number <= paginationCount; number++) {
    items.push(
      <Pagination.Item
        key={number}
        active={state.active === number}
        onClick={() => handlePagination(number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  const handleFlowChange = (event) => {
    const systemValue =
      event.target.value === "VAL_EOD" ? ["ENDUR", "EPS"] : [];
    setState({
      ...state,
      system: systemValue,
      selectedFlow: event.target.value,
    });
  };

  return (
    <Container
      style={{
        /*border: "solid green 2px",*/
        padding: "50px"
      }}
    >
      <Row style={{ marginBottom: "50px" }}>
        <Col>
          <BasicSelect
            items={state.flow}
            changeHandler={handleFlowChange}
            id="flow"
            label="Flow"
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
          <Button label="Search" />
        </Col>
      </Row>
      
      {/* <Row>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Header key</th>
              <th>Batch Date</th>
              <th>Batch Number</th>
              <th>Batch Version</th>
              <th>Source Run Date</th>
              <th>Controller Status</th>
              <th>Batch Count</th>
              <th>Publisher Status</th>
              <th>Subscriber Status</th>
            </tr>
          </thead>
          <tbody>
            {state.tableData &&
              state.tableData.map((item) => {
                return (
                  <tr key={item.headerKey}>
                    <td>{item.headerKey}</td>
                    <td>{item.batchDate}</td>
                    <td>{item.batchNumber}</td>
                    <td>{item.batchVersion}</td>
                    <td>{item.sourceRunDate}</td>
                    <td>{item.controllerStatus}</td>
                    <td>{item.batchCount}</td>
                    <td>
                      <Link
                        to={{
                          pathname: "/details",
                          state: {
                            ...state,
                            type: "Publisher Status",
                            batchDate: item.batchDate,
                            batchVersion: item.batchVersion,
                          },
                        }}
                      >
                        {item.publisherStatus}
                      </Link>
                    </td>
                    <td>
                      <Link
                        to={{
                          pathname: "/details",
                          state: {
                            ...state,
                            type: "Subscriber Status",
                            batchDate: item.batchDate,
                            batchVersion: item.batchVersion,
                          },
                        }}
                      >
                        {item.subscriberStatus}
                      </Link>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
        <Pagination>{items}</Pagination>
      </Row> */}
      <Row>
        <DataTable columns={columns} rows={rows} checkboxSelection={false}/>
      </Row>
    </Container>
  );
};

export default Summary;
