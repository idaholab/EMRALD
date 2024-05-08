import React, { useEffect } from 'react'
import { useCustomForm } from './useCustomForm';
import { Box } from '@mui/material';

const CustomFormTemplate = () => {
  // Items available for use within the custom form /
  const { diagrams, logicNodes, variables, states, events, actions } = useCustomForm();

  useEffect(() => {
    console.log(diagrams);
    console.log(logicNodes);
    console.log(variables);
    console.log(states);
    console.log(events);
    console.log(actions);
  })
  return (
    <Box display={'flex'} flexDirection={'column'}>
      
    </Box>
  )
}

export default CustomFormTemplate;
