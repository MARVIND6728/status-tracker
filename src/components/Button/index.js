import * as React from 'react';

import Button from '@mui/material/Button';

const BasicButton = (props) =>  {
  return (
      <Button size="small" variant="contained" color="success" onClick={props.onClick} disabled={props.disabled}>
        {props.label}
      </Button>
  );
}


export default BasicButton;
