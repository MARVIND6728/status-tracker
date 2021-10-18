import React, { useEffect, useState } from "react";
import Select from "../Select";
import { Container, Row, Col } from "react-bootstrap";
import targetStatusData from "../../targetStatusData.json";
import publisherStatusData from "../../publisherStatusData.json";
import { useLocation } from "react-router-dom";
import Date from "../Date";
import Button from "../Button";
import TextField from "@mui/material/TextField";
import DataTable from "../DataTable";

const Details = () => {
  const publisherStatusCulumns = [
    { field: "executionKey", headerName: "Execution Key", width: 120 },
    { field: "typeCD", headerName: "Type CD", width: 90 },
    { field: "fileName", headerName: "FileName", width: 100 },
    { field: "recordCount", headerName: "Record Count", width: 120 },
    { field: "attributeCount", headerName: "Attribute Count", width: 145 },
    { field: "version", headerName: "Version", width: 90 },
    { field: "whereCondition", headerName: "Where Condition", width: 350 },
    { field: "status", headerName: "Status", width: 170 },
  ];

  const subscriberStatusColumns = [
    { field: "executionKey", headerName: "Execution Key", width: 120 },
    { field: "typeCD", headerName: "Type CD", width: 90 },
    { field: "target", headerName: "Target", width: 90 },
    { field: "fileName", headerName: "FileName", width: 100 },
    { field: "recordCount", headerName: "Record Count", width: 120 },
    { field: "attributeCount", headerName: "Attribute Count", width: 145 },
    { field: "version", headerName: "Version", width: 90 },
    { field: "whereCondition", headerName: "Where Condition", width: 350 },
    { field: "status", headerName: "Status", width: 100 },
  ];

  const location = useLocation();

  // const data =
  //   location.state && location.state.type === "Publisher Status"
  //     ? publisherStatusData
  //     : targetStatusData;

  const [state, setState] = useState({
    flow: ["VAL_ID", "VAL_EOD"],
    system: [],
    pub_sub: ["Publisher Status", "Subscriber Status"],
    selectedFlow: "",
    selectedSystem: "",
    selectedPub_Sub: "",
    selectedRows: [],
    disabledReflow: true,
    rows: null,
  });

  const getData = async () => {
    const options = {
      method: "GET",
    };

    const url = `http://localhost:9090/pubsubstatus?systemcd=${
      state.selectedSystem || ""
    }&flowcd=${state.selectedFlow || ""}&batchdate=${
      state.batchDate || ""
    }&version=${state.batchVersion || ""}&pubsub=${
      state.selectedPub_Sub || ""
    }&headerkey=${state.headerKey || ""}`;

    const response = await fetch(url, options);
    const data = await response;

    const rows = data.map((item, index) => {
      item["id"] = index;
      return item;
    });

    return rows;
  };

  useEffect(() => {
    let rowsData = null;
    if (location.state.type !== "") {
      rowsData = getData();
    }
    let newState = { ...state, ...location.state, rows: rowsData };
    setState(newState);
  }, []);

  const columns =
    location.state && location.state.type === "Publisher Status"
      ? publisherStatusCulumns
      : subscriberStatusColumns;

  // const rows = data.map((item, index) => {
  //   item["id"] = index;
  //   return item;
  // });

  const handleFlowChange = (event) => {
    const systemItems =
      event.target.value === "VAL_EOD" ? ["ENDUR", "EPS"] : [];
    setState({
      ...state,
      system: systemItems,
      selectedFlow: event.target.value,
      selectedSystem: "",
    });
  };

  const handleSystemChange = (event) => {
    setState({ ...state, selectedSystem: event.target.value });
  };

  const handlePubSub = (event) =>
    setState({ ...state, selectedPub_Sub: event.target.value });

  const getSelectedRowsId = (rows) => {
    setState({
      ...state,
      selectedRows: rows,
      disabledReflow: rows.length ? false : true,
    });
  };

  const reflowHandler = async () => {
    let executionKeys =
      state.selectedRows &&
      state.selectedRows.map((rowId) => state.rows[rowId].executionKey);
    const options = {
      method: "PUT",
      headers: {
        componentType: state.selectedPub_Sub,
        batchExecutationKey: executionKeys.join(","),
      },
    };
    const response = await fetch(
      "http://test-republish-nagp-infohub-int-01.apps.testb.0001.o2.wu2.csl.cd2.bp.com/api/RepublishBatch/",
      options
    );
    console.log(response);
  };

  const searchHandler = async () => {
    const rowsData = getData();
    setState({ ...state, rows: rowsData });
  };

  return (
    <Container
      style={{
        // border: "solid green 2px",
        padding: "50px",
      }}
    >
      <Row style={{ marginBottom: "50px" }}>
        <Col>
          <Select
            items={state.flow}
            changeHandler={handleFlowChange}
            id="flow"
            label="Flow"
            value={state.selectedFlow}
          />
        </Col>
        <Col>
          <Select
            items={state.system}
            changeHandler={handleSystemChange}
            id="system"
            label="System"
            value={state.selectedSystem}
          />
        </Col>
        <Col>
          <Date
            label="Batch Date"
            value={state.batchDate}
            onChange={(date) => {
              setState({ ...state, batchDate: date });
            }}
          />
        </Col>
        <Col>
          <TextField
            size="small"
            id="outlined-basic"
            label="Batch Version"
            variant="outlined"
            value={state.batchVersion}
            onChange={(e) =>
              setState({ ...state, batchVersion: e.target.value })
            }
          />
        </Col>
        <Col>
          <Select
            items={state.pub_sub}
            changeHandler={handlePubSub}
            id="system"
            label="PUB_SUB"
            value={state.type}
          />
        </Col>
        <Col>
          <Button label="Search" onClick={searchHandler} />
        </Col>
      </Row>
      {state.rows && (
        <React.Fragment>
          <Row>
            <DataTable
              columns={columns}
              rows={state.rows}
              checkboxSelection={true}
              getSelectedRowsId={getSelectedRowsId}
            />
          </Row>
          <Row
            style={{ marginTop: "-45px", float: "right", marginRight: "180px" }}
          >
            <Col>
              <Button
                label="ReFlow"
                onClick={reflowHandler}
                disabled={state.disabledReflow}
              />
            </Col>
          </Row>
        </React.Fragment>
      )}
    </Container>
  );
};

export default Details;
