import * as React from 'react';

import Button from '@mui/material/Button';

const BasicButton = (props) =>  {
  return (
      <Button variant="contained" color="success">
        {props.label}
      </Button>
  );
}


export default BasicButton;
