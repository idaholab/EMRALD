import React from 'react';
import { useDrop } from 'react-dnd';
import { State } from '../../types/State';
import { Box } from '@mui/material';

import StateTable from '../forms/VariableForm/FormFieldsByType/StateTable';
import {
  AccrualStateItem,
  useVariableFormContext,
} from '../forms/VariableForm/VariableFormContext';

const StateDropTarget: React.FC = () => {
  const { accrualStatesData, setAccrualStatesData, sortNewStates } =
    useVariableFormContext();

  const [{ isOver }, drop] = useDrop({
    accept: 'State',
    drop: (item: State) => {
      const newStateItem: AccrualStateItem = {
        stateName: item.name,
        accrualMult: 1,
        multRate: 'trHours',
        accrualTable: [],
        type: 'ctMultiplier',
      };
      if (accrualStatesData) {
        const exists = accrualStatesData.some(
          (state) => state.stateName === newStateItem.stateName,
        );
        if (item && !exists) {
          setAccrualStatesData(
            sortNewStates([...accrualStatesData, newStateItem]),
          );
        }
      } else {
        setAccrualStatesData(sortNewStates([newStateItem]));
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const backgroundColor = isOver ? 'lightgreen' : 'white';

  return (
    <Box
      ref={drop}
      sx={{ mt: 3 }}
      style={{
        height: '100%',
        backgroundColor,
      }}
    >
      {accrualStatesData && accrualStatesData.length > 0 ? (
        <StateTable />
      ) : (
        <Box
          sx={{
            border: '2px dashed gray',
            height: '75px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontWeight: 'bold',
          }}
        >
          Drop State Items here
        </Box>
      )}
    </Box>
  );
};

export default StateDropTarget;
