import { TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { DialogComponent } from '../../common';
import { appData } from '../../../hooks/useAppData';
import { Diagram } from '../../../types/Diagram';
import { State } from '../../../types/State';
import { Action } from '../../../types/Action';
import { Event } from '../../../types/Event';

const SearchField = () => {
  const [value, setValue] = useState<string>('');
  const [openSearchDialog, setOpenSearchDialog] = useState<boolean>(false);
  const [diagrams, setDiagrams] = useState<Diagram[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [actions, setActions] = useState<Action[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  const onSubmit = () => {
    console.log('Search submitted:', value);
    // search through diagrams
    let tempDiagrams: Diagram[] = [];
    appData.value.DiagramList.forEach((diagram) => {
      if (
        diagram.name.toLowerCase().includes(value.toLowerCase()) ||
        diagram.desc.toLowerCase().includes(value.toLowerCase())
      ) {
        tempDiagrams.push(diagram);
      }
    });
    setDiagrams(tempDiagrams);

    // search through states
    let tempStates: State[] = [];
    appData.value.StateList.forEach((state) => {
      if (
        state.name.toLowerCase().includes(value.toLowerCase()) ||
        state.desc.toLowerCase().includes(value.toLowerCase())
      ) {
        tempStates.push(state);
      }
    });
    setStates(tempStates);

    // search through actions
    let tempActions: Action[] = [];
    appData.value.ActionList.forEach((action) => {
      if (
        action.name.toLowerCase().includes(value.toLowerCase()) ||
        action.desc.toLowerCase().includes(value.toLowerCase())
      ) {
        tempActions.push(action);
      }
    });
    setActions(tempActions);

    // search through events
    let tempEvents: Event[] = [];
    appData.value.EventList.forEach((event) => {
      if (
        event.name.toLowerCase().includes(value.toLowerCase()) ||
        event.desc.toLowerCase().includes(value.toLowerCase())
      ) {
        tempEvents.push(event);
      }
    });
    setEvents(tempEvents);

    setOpenSearchDialog(true);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      onSubmit();
    }
  };
  const handleClose = () => {
    setOpenSearchDialog(false);
    setValue('');
    setDiagrams([]);
    setStates([]);
    setActions([]);
    setEvents([]);
  };

  return (
    <>
      <TextField
        id="search-field"
        variant="outlined"
        label="Search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        size="small"
        InputProps={{ style: {marginRight: '50px', borderRadius: '15px'}  }}
        onKeyDown={handleKeyDown}
      />
      <DialogComponent open={openSearchDialog} title="Search Results" onClose={handleClose}>
        <Typography variant="h4">Diagrams</Typography>
        {diagrams.map((diagram) => (
          <Typography key={diagram.id} variant="h6">
            {diagram.name}
          </Typography>
        ))}
        <Typography variant="h4">States</Typography>
        {states.map((state) => (
          <Typography key={state.id} variant="h6">
            {state.name}
          </Typography>
        ))}
        <Typography variant="h4">Actions</Typography>
        {actions.map((action) => (
          <Typography key={action.id} variant="h6">
            {action.name}
          </Typography>
        ))}
        <Typography variant="h4">Events</Typography>
        {events.map((event) => (
          <Typography key={event.id} variant="h6">
            {event.name}
          </Typography>
        ))}
      </DialogComponent>
    </>
  );
};

export default SearchField;
