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
import moment from 'moment';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Collapse from '@mui/material/Collapse';

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
    type : "",
    selectedPub_Sub: "",
    selectedRows: [],
    disabledReflow: true,
    rows: null,
    batchVersion : '',
    headerKey : '',
    open : false,
    severity : 'success',
    severityMessage : ''

  });

  const getData = async (url) => {
    const options = {
      method: "GET",
    };
    
    console.log(url)
    const response = await fetch(url, options);
    const data = await response.json();

    console.log(data);
    const rows = data.map((item, index) => {
      item["id"] = index;
      return item;
    });

    return rows;
  };

  useEffect(() => {
    let rowsData = null;
    if (location.state.type !== "") {
      const publishStatusUrl = `http://nagp-ilcntrl-status-srvs-nagp-infohub-tst-01.apps.test-b.0001.o2.wu2.csl.cd2.bp.com/publishstatus/${location.state.headerKey}`;
      const targetStatusUrl = `http://nagp-ilcntrl-status-srvs-nagp-infohub-tst-01.apps.test-b.0001.o2.wu2.csl.cd2.bp.com/targetstatus/${location.state.headerKey}`;

      const url = location.state.type === 'Publisher Status' ? publishStatusUrl : targetStatusUrl;
      const pub_sub = location.state.type === 'Publisher Status' ? 'publish' : 'subscribe';

      const batchDate = moment(location.state.batchDate).format('DD-MMM-YYYY');

      (async function() {
        const data = await getData(url);
        let newState = { ...state, ...location.state, rows: data,selectedPub_Sub:pub_sub, batchDate: batchDate };
        console.log("newState",newState)
        setState(newState);
      })();

    }
    
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
    setState({ ...state, selectedPub_Sub: event.target.value === 'Publisher Status' ? 'publish' : 'subscribe',type : event.target.value });

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
        componentType: state.selectedPub_Sub === 'publish' ? 'PUB' : 'SUB',
        batchExecutationKey: executionKeys.join(","),
      },
    };
    const response = await fetch(
      "http://test-republish-nagp-infohub-int-01.apps.testb.0001.o2.wu2.csl.cd2.bp.com/api/RepublishBatch/",
      options
    );
    console.log(response);

    response === 'true' ? setState({...state,open : true,severity:"success", severityMessage: "Success"}) :
    setState({...state,open:true,severity:"error", severityMessage: "Error"})
   
  };

  const searchHandler = async () => {
    const url = `http://nagp-ilcntrl-status-srvs-nagp-infohub-tst-01.apps.test-b.0001.o2.wu2.csl.cd2.bp.com/pubsubstatus?systemcd=${
      state.selectedSystem || ""
    }&flowcd=${state.selectedFlow || ""}&batchdate=${
      state.batchDate || ""
    }&version=${state.batchVersion || ""}&pubsub=${
      state.selectedPub_Sub || ""
    }&headerkey=${
      state.headerKey || ""}
    `;

    const rowsData = await getData(url);
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
             onChange={(e) =>
              setState({ ...state, batchVersion: e.target.value })
            }
            value = {state.batchVersion}
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
          <TextField
            size="small"
            id="outlined-basic"
            label="Header Key"
            type = "number"
            variant="outlined"
            onChange={(e) =>
              setState({ ...state, headerKey: e.target.value })
            }
            value = {state.headerKey}
          />
        </Col>
        <Col>
          <Button label="Search" onClick={searchHandler} />
        </Col>
      </Row>
      <Row>
      <Collapse in={state.open}>
        <Alert
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setState({...state,open :false})
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
          severity = {state.severity}
        >
          {state.severityMessage}
        </Alert>
      </Collapse>
      </Row>
      {state.rows && (state.rows.length !==0 ? (
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
        </React.Fragment>) : <h1>No Data Found</h1>
      )}
    </Container>
  );
};

export default Details;
