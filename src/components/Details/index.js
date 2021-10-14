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

  const data =
    location.state && location.state.type === "Publisher Status"
      ? publisherStatusData
      : targetStatusData;

  const [state, setState] = useState({
    flow: ["VAL_ID", "VAL_EOD"],
    system: [],
    pub_sub: ["Publisher Status", "Subscriber Status"],
    selectedFlow: "",
    selectedSystem: "",
    selectedPub_Sub: "",
    selectedRows: [],
    disabledReflow: true,
  });

  useEffect(() => {
    let newState = { ...state, ...location.state };
    setState(newState);
  },[]);

  const columns =
    location.state && location.state.type === "Publisher Status"
      ? publisherStatusCulumns
      : subscriberStatusColumns;

  const rows = data.map((item, index) => {
    item["id"] = index;
    return item;
  });

  const handleD1 = (event) => {
    console.log("handleD1");
    const systemItems =
      event.target.value === "VAL_EOD" ? ["ENDUR", "EPS"] : [];
    setState({
      ...state,
      system: systemItems,
      selectedFlow: event.target.value,
    });
  };

  const handleD2 = (event) => {
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

  const reflowHandler = () => {
    let executionKeys =
      state.selectedRows &&
      state.selectedRows.map((rowId) => rows[rowId].executionKey);
    const options = {
      method: "PUT",
      headers: {
        componentType: state.selectedPub_Sub,
        batchExecutationKey: executionKeys.join(","),
      },
    };
    fetch(
      "http://test-republish-nagp-infohub-int-01.apps.testb.0001.o2.wu2.csl.cd2.bp.com/api/RepublishBatch/",
      options
    ).then( response => console.log(response)).catch(error => console.log("error"));
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
            changeHandler={handleD1}
            id="flow"
            label="Flow"
            value={state.selectedFlow}
          />
        </Col>
        <Col>
          <Select
            items={state.system}
            changeHandler={handleD2}
            id="system"
            label="System"
            value={state.selectedSystem}
          />
        </Col>
        <Col>
          <Date label="Batch Date" value={state.batchDate} />
        </Col>
        <Col>
          <TextField
            size="small"
            id="outlined-basic"
            label="Batch Version"
            variant="outlined"
            value={state.batchVersion}
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
          <Button label="Search" />
        </Col>
      </Row>
      <Row>
        <DataTable
          columns={columns}
          rows={rows}
          checkboxSelection={true}
          getSelectedRowsId={getSelectedRowsId}
        />
      </Row>
      <Row style={{ marginTop: "-45px", float: "right", marginRight: "180px" }}>
        <Col>
          <Button
            label="ReFlow"
            onClick={reflowHandler}
            disabled={state.disabledReflow}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Details;
