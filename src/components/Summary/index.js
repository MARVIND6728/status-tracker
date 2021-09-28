import React, { useState } from "react";
import Select from "../Select";
import {
  Button,
  Container,
  Row,
  Col,
  Table,
  Pagination,
} from "react-bootstrap";
import targetStatusData from "../../targetStatusData.json";
import publisherStatusData from "../../publisherStatusData.json";
import {useLocation} from 'react-router-dom';

const Summary = () => {
  let items = [];
  const location = useLocation();
  const data = location.state.type === 'publisherStatus' ? publisherStatusData : targetStatusData;

  let paginationCount = Math.ceil(data.length / 10);
  const [state, setState] = useState({
    flow: ["VAL_ID", "VAL_EOD"],
    system: [],
    tableData: data.slice(0, 10),
    pub_sub: ["Publisher Status", "Subscriber Status"],
    active: 1,
    start: 0,
    end: 10,
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
        border: "solid green 2px",
        padding: "50px",
        marginBottom: "50px",
      }}
    >
      <Row style={{ marginBottom: "50px" }}>
        <Col>
          Flow &nbsp;&nbsp;&nbsp;{" "}
          <Select items={state.flow} changeHandler={handleD1} id="flow" />
        </Col>
        <Col>
          System &nbsp;&nbsp;&nbsp;
          <Select items={state.system} changeHandler={handleD2} id="system" />
        </Col>
        <Col>
          Batch Date &nbsp;&nbsp;&nbsp; <input type="date" id="batchDate" />
        </Col>
        <Col>
          Version &nbsp;&nbsp;&nbsp; <input type="text" id="version" />
        </Col>
        <Col>
          PUB_SUB &nbsp;&nbsp;&nbsp;
          <Select items={state.pub_sub} changeHandler={handleD2} id="system" />
        </Col>
      </Row>
      <Row style={{ marginBottom: "75px", textAlign: "center" }}>
        <Col>
          <Button variant="success">Search</Button>
        </Col>
      </Row>
      <Row>
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
        <Pagination>{items}</Pagination>
      </Row>
    </Container>
  );
};

export default Summary;
