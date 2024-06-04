import {
  Box,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Tooltip,
} from '@mui/material';
import { useEventFormContext } from '../EventFormContext';
import { useDrop } from 'react-dnd';
import { State } from '../../../../types/State';
import { StyledTableCell, StyledTableRow } from '../../ActionForm/ActionToStateTable';
import DeleteIcon from '@mui/icons-material/Delete';

const StateChange = () => {
  const { allItems, ifInState, setAllItems, setIfInState, triggerStates, setTriggerStates } =
    useEventFormContext();

  const [{ isOver }, drop] = useDrop({
    accept: 'State',
    drop: (item: State) => {
      if (!triggerStates.includes(item.name)) {
        setTriggerStates([...triggerStates, item.name]);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });
  const backgroundColor = isOver ? 'lightgreen' : 'white';
  const removeTriggerState = (name: string) => {
    var newTriggerStates = triggerStates;
    newTriggerStates = newTriggerStates.filter((state) => state !== name);
    setTriggerStates(newTriggerStates);
  };
  return (
    <div>
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        name="radio-buttons-group"
        value={ifInState}
        onChange={(e) => setIfInState(e.target.value === 'true' ? true : false)}
        sx={{ display: 'flex', flexDirection: 'row' }}
      >
        <FormControlLabel value="true" control={<Radio />} label="On Enter State/s" />
        <FormControlLabel value="false" control={<Radio />} label="On Exit State/s" />
      </RadioGroup>

      <FormControlLabel
        label="All Items"
        value={allItems}
        control={
          <Checkbox
            checked={allItems ? true : false}
            onChange={(e) => setAllItems(e.target.checked)}
          />
        }
      />
      <Box
        ref={drop}
        sx={{ mt: 3 }}
        style={{
          height: '100%',
          backgroundColor,
        }}
      >
        {triggerStates.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <StyledTableRow>
                  <StyledTableCell>State</StyledTableCell>
                  <StyledTableCell>Command</StyledTableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {triggerStates.map((name, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell>{name}</StyledTableCell>
                    <StyledTableCell>
                      <Tooltip title="Delete Row">
                        <DeleteIcon
                          sx={{ cursor: 'pointer', ml: 3 }}
                          onClick={() => removeTriggerState(name)}
                        />
                      </Tooltip>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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
    </div>
  );
};

export default StateChange;
