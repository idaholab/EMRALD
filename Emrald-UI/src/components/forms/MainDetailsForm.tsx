import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import React, { Dispatch, SetStateAction } from 'react';
import {
  ActionType,
  DiagramType,
  EventType,
  MainItemTypes,
  StateType,
  VariableType,
} from '../../types/ItemTypes';
import { Box, Button } from '@mui/material';
import { useWindowContext } from '../../contexts/WindowContext';

import { Event } from '../../types/Event';
import { Variable } from '../../types/Variable';

type ValueTypes<T extends MainItemTypes> = T extends 'Diagram'
  ? DiagramType
  : T extends 'State'
  ? StateType
  : T extends 'Event'
  ? EventType
  : T extends 'Action'
  ? ActionType
  : T extends 'Variable'
  ? VariableType
  : never;

interface MainDetailsFormProps<T extends MainItemTypes> {
  children?: React.ReactNode;
  desc: string;
  helperText: string;
  itemType: T;
  name: string;
  type: ValueTypes<T>;
  typeLabel?: string;
  typeOptions: { value: string; label: string }[];

  handleSave: (eventData?: Event, variableData?: Variable) => void;
  handleTypeChange?: (newType: VariableType) => void;
  reset: () => void;
  setDesc: (desc: string) => void;
  setName: (name: string) => void;
  setType: Dispatch<SetStateAction<ValueTypes<T>>>;
}

const MainDetailsForm = <T extends MainItemTypes>({
  children,
  desc,
  helperText,
  name,
  type,
  typeLabel,
  typeOptions,

  handleSave,
  handleTypeChange,
  reset,
  setDesc,
  setName,
  setType,
}: MainDetailsFormProps<T>) => {
  const { handleClose } = useWindowContext();
  return (
    <>
      <FormControl variant="outlined" size="small" sx={{ minWidth: 120, width: '100%' }}>
        <InputLabel id="type-select-label">{typeLabel ? typeLabel : 'Type'}</InputLabel>
        <Select
          labelId="type-select-label"
          id="type-select"
          value={type as string} // Cast type as string
          onChange={(event: SelectChangeEvent<string>) => {
            setType(event.target.value as ValueTypes<T>);
            handleTypeChange && handleTypeChange(event.target.value as VariableType);
            reset();
          }} // Cast event.target.value as ValueTypes<T>
          label={typeLabel ? typeLabel : 'Type'}
        >
          {typeOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="Name"
        margin="normal"
        variant="outlined"
        size="small"
        sx={{ mb: 0 }}
        value={name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
        fullWidth
        helperText={helperText}
      />
      <TextField
        label="Description"
        variant="outlined"
        size="small"
        fullWidth
        multiline
        margin="normal"
        value={desc}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDesc(e.target.value)}
      />
      {children}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 5 }}>
        <Button variant="contained" color="primary" sx={{ mr: 2 }} onClick={() => handleSave()}>
          Save
        </Button>
        <Button variant="contained" color="secondary" onClick={() => handleClose()}>
          Cancel
        </Button>
      </Box>
    </>
  );
};

export default MainDetailsForm;
