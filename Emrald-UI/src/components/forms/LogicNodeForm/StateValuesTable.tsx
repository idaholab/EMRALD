import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Paper from '@mui/material/Paper';
import { useDiagramContext } from '../../../contexts/DiagramContext';
import { useStateContext } from '../../../contexts/StateContext';
import { CompChildItems, StateEvalValue } from '../../../types/EMRALD_Model';

export interface ComponentStateValue {
  stateName: string;
  stateValue: StateEvalValue;
}
interface StateValuesTableProps {
  componentNode: CompChildItems | undefined;
  setCurrentNodeStateValues?: React.Dispatch<React.SetStateAction<ComponentStateValue[]>>
}

const StateValuesTable: React.FC<StateValuesTableProps> = ({ componentNode, setCurrentNodeStateValues }) => {
  const { getDiagramByDiagramName } = useDiagramContext();
  const [stateValues, setStateValues] = useState<ComponentStateValue[]>([]);
  const { getStateByStateName } = useStateContext();

  useEffect(() => {
    const diagramStates = getDiagramByDiagramName(componentNode?.diagramName || '')?.states;
    if (diagramStates && componentNode?.stateValues && componentNode.stateValues.length === 0) {
      setStateValues(
        diagramStates.map((stateName) => {
          const state = getStateByStateName(stateName);
          return {
            stateName: state.name,
            stateValue: state.defaultSingleStateValue || 'False',
          };
        }),
      );
    } else {
      setStateValues(componentNode?.stateValues || []);
    }
  }, [componentNode, getDiagramByDiagramName]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    updatedStateValue: ComponentStateValue,
  ) => {
    const { stateName } = updatedStateValue;
    const value = event.target.value as StateEvalValue;
    const updatedValues = stateValues.map((stateValue) => {
      if (stateValue.stateName === stateName) {
        return { ...stateValue, stateValue: value };
      }
      return stateValue;
    });

    if (setCurrentNodeStateValues) {
      setCurrentNodeStateValues(updatedValues);
    }
    setStateValues(updatedValues);
  };

  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold', p: 2 }}>State Name</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Logic Evaluation Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stateValues.map((stateValue, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {stateValue.stateName}
              </TableCell>
              <TableCell>
                <FormControl>
                  <RadioGroup
                    row
                    aria-labelledby="eval-values"
                    name="eval-buttons-group"
                    value={stateValue.stateValue}
                    onChange={(e) => handleChange(e, stateValue)}
                  >
                    <FormControlLabel value="False" control={<Radio />} label="False" />
                    <FormControlLabel value="True" control={<Radio />} label="True" />
                    <FormControlLabel value="Ignore" control={<Radio />} label="Ignore" />
                  </RadioGroup>
                </FormControl>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default StateValuesTable;
