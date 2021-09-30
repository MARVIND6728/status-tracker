import React, { useState } from "react";
import Select from "../Select";
import {
  Container,
  Row,
  Col,
  Table,
  Pagination,
} from "react-bootstrap";
import targetStatusData from "../../targetStatusData.json";
import publisherStatusData from "../../publisherStatusData.json";
import {useLocation} from 'react-router-dom';
import Date from '../Date';
import Button from '../Button';
import TextField from "@mui/material/TextField";
import DataTable from "../DataTable";


const Details = () => {

  

  let items = [];
  const location = useLocation();
  const data = location.state && location.state.type === 'Publisher Status' ? publisherStatusData : targetStatusData;
  const [state, setState] = useState({
    flow: ["VAL_ID", "VAL_EOD"],
    system: [],
    tableData: data.slice(0, 10),
    pub_sub: ["Publisher Status", "Subscriber Status"],
    active: 1,
    start: 0,
    end: 10,
  });


  let paginationCount = Math.ceil(data.length / 10);

 const columns = [
    { field: "executionKey", headerName: "Execution Key", width: 120 },
    { field: "typeCD", headerName: "Type CD", width: 90 },
    { field: "target", headerName: "Target", width: 90 },
    { field: "fileName", headerName: "FileName", width: 100 },
    { field: "recordCount", headerName: "Record Count", width: 120 },
    { field: "attributeCount", headerName: "Attribute Count", width: 145 },
    { field: "version", headerName: "Version", width: 90 },
    { field: "whereCondition", headerName: "Where Condition", width: 350},
    { field: "status", headerName: "Status", width: 100 }
  ];

  const rows = data.map((item, index) => {
    item["id"] = index;
    return item;
  });

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

  const handleD1 = (event) => {
    const systemValue =
      event.target.value === "VAL_EOD" ? ["ENDUR", "EPS"] : [];
    setState({ ...state, system: systemValue });
  };

  const handleD2 = (event) => {};
  return (
    <Container
      style={{
        // border: "solid green 2px",
        padding: "50px",
        marginBottom: "50px",
      }}
    >
      <Row style={{ marginBottom: "50px" }}>
        <Col>
          <Select items={state.flow} changeHandler={handleD1} id="flow" label="Flow" value={location.state.selectedFlow}/>
        </Col>
        <Col>
          <Select items={location.state.system || state.system} changeHandler={handleD2} id="system" label="System" value={location.state.selectedSystem}/>
        </Col>
        <Col>
          <Date label="Batch Date" value={location.state.batchDate}/>
        </Col>
        <Col>
          <TextField id="outlined-basic" label="Batch Version" variant="outlined" value={location.state.batchVersion} />
        </Col>
        <Col>
          <Select items={state.pub_sub} changeHandler={handleD2} id="system" label="PUB_SUB" value={location.state.type}/>
        </Col>
      </Row>
      <Row style={{ marginBottom: "75px", textAlign: "center" }}>
        <Col>
           <Button label="Search"/>
        </Col>
      </Row>
      {/* <Row>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Execution Key</th>
              <th>Type CD</th>
              <th>Target</th>
              <th>FileName</th>
              <th>Record Count</th>
              <th>Attribute Count</th>
              <th>Version</th>
              <th>Where Condition</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {state.tableData &&
              state.tableData.map((item) => {
                return (
                  <tr key={item.executionKey}>
                    <td>{item.executionKey}</td>
                    <td>{item.typeCD}</td>
                    <td>{item.target}</td>
                    <td>{item.fileName}</td>
                    <td>{item.recordCount}</td>
                    <td>{item.attributeCount}</td>
                    <td>{item.version}</td>
                    <td>{item.whereCondition}</td>
                    <td>{item.status}</td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
        <Pagination>
          {items}
        </Pagination>
      </Row> */}
      <Row>
        <DataTable columns={columns} rows={rows} />
      </Row>
    </Container>
  );
};

export default Details;
