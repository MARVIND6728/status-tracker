import * as React from "react";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import moment from 'moment';

const  BasicDatePicker = (props) => {
  const [value, setValue] = React.useState(null);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label={props.label}
        value={props.value || value}
        onChange={(newValue) => {
          newValue= moment(newValue).format('DD-MMM-YYYY');
          setValue(newValue);
          props.onChange(newValue);
        }}
        inputFormat = 'dd-MMM-yyyy'
        renderInput={(params) => <TextField {...params} size="small"/>}
      />
    </LocalizationProvider>
  );
}

export default BasicDatePicker;
