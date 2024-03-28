import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import React from 'react';
import { ExtSim } from '../../types/ExtSim';
import { LogicNode } from '../../types/LogicNode';
import { Variable } from '../../types/Variable';
import { Action } from '../../types/Action';
import { Event } from '../../types/Event';
import { State } from '../../types/State';
import { Diagram } from '../../types/Diagram';
import { MainItemTypes } from '../../types/ItemTypes';

interface MainDetailsFormProps {
  item : Diagram | State | Action | Event | Variable | LogicNode | ExtSim,
  itemType : MainItemTypes, //This is the type of the object that was updated
  typeLabel?: string;
  typeOptions: { value: string; label: string }[];
  typeDisabled?: boolean;
  // name: string;
  // setName: (name: string) => void;
  // desc: string;
  // setDesc: (desc: string) => void;
  // type: string;
  // setType: (value: string) => void;
}

const MainDetailsForm: React.FC<MainDetailsFormProps> = ({
  item,
  typeLabel,
  // type,
  // setType,
  typeOptions,
  typeDisabled,
  // name,
  // setName,
  // desc,
  // setDesc,
}) => {
  return (
    <>
      <FormControl
        variant="outlined"
        size="small"
        sx={{ minWidth: 120, width: '100%' }}
      >
        <InputLabel id="demo-simple-select-standard-label">
          {typeLabel ? typeLabel : 'Type'}
        </InputLabel>
        <Select
          labelId="type-select"
          id="type-select"
          value={type}
          onChange={(event: SelectChangeEvent<string>) => {
            setType(event.target.value);

          }}
          label={typeLabel ? typeLabel : 'Type'}
          disabled={typeDisabled}
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
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setName(e.target.value)
        }
        fullWidth
      />
      <TextField
        label="Description"
        variant="outlined"
        size="small"
        fullWidth
        multiline
        margin="normal"
        value={item.desc}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setDesc(e.target.value)
        }
      />
    </>
  );
};

export default MainDetailsForm;
