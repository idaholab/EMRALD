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
  GateType,
  MainItemTypes,
  StateType,
  VariableType,
} from '../../types/ItemTypes';
import { Box, Button } from '@mui/material';
import { useWindowContext } from '../../contexts/WindowContext';

type ValueTypes<T extends MainItemTypes> = T extends 'Diagram'
  ? DiagramType
  : T extends 'LogicNode'
  ? GateType
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
  children: React.ReactNode;
  itemType: T;
  typeLabel?: string;
  type: ValueTypes<T>;
  typeOptions: { value: string; label: string }[];
  typeDisabled?: boolean;
  nameDisabled?: boolean;
  descDisabled?: boolean;
  name: string;
  desc: string;
  nameError?: boolean;
  error?: boolean;
  errorMessage?: string;
  handleSave: () => void;
  handleNameChange: (name: string) => void;
  handleTypeChange?: (newType: ValueTypes<T>) => void;
  reset?: () => void;
  setDesc: (desc: string) => void;
  setType: Dispatch<SetStateAction<ValueTypes<T>>>;
  reqPropsFilled: boolean;
}

const MainDetailsForm = <T extends MainItemTypes>({
  children,
  name,
  type,
  typeLabel,
  typeOptions,
  typeDisabled,
  nameDisabled,
  descDisabled,
  desc,
  nameError,
  error,
  errorMessage,
  reqPropsFilled,
  handleSave,
  setType,
  setDesc,
  handleNameChange,
  handleTypeChange,
  reset,
}: MainDetailsFormProps<T>) => {
  const { handleClose } = useWindowContext();
  return (
    <>
      <FormControl variant="outlined" size="small" sx={{ minWidth: 120, width: '100%' }}>
        <InputLabel id="type-select-label">{typeLabel ? typeLabel : 'Type'}</InputLabel>
        <Select
          labelId="type-select-label"
          id="type-select"
          value={type as ValueTypes<T>}
          disabled={typeDisabled}
          onChange={(event: SelectChangeEvent<ValueTypes<T>>) => {
            setType(event.target.value as ValueTypes<T>);
            handleTypeChange && handleTypeChange(event.target.value as ValueTypes<T>);
            reset && reset();
          }}
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
        disabled={nameDisabled}
        sx={{ mb: 0 }}
        value={name}
        onChange={(e) => handleNameChange(e.target.value)}
        fullWidth
        error={nameError}
        helperText={nameError ? errorMessage : ''}
      />
      <TextField
        label="Description"
        variant="outlined"
        size="small"
        disabled={descDisabled}
        fullWidth
        multiline
        margin="normal"
        value={desc}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDesc(e.target.value)}
      />
      {children}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 5 }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ mr: 2 }}
          onClick={() => handleSave()}
          disabled={error || !reqPropsFilled}
        >
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
