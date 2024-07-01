import { Button, IconButton, InputAdornment, Menu, MenuItem, TextField } from '@mui/material';
import { ReactNode, useState } from 'react';
import { DialogComponent } from '../../common';
import { appData } from '../../../hooks/useAppData';
import { Diagram } from '../../../types/Diagram';
import { State } from '../../../types/State';
import { Action } from '../../../types/Action';
import { Event } from '../../../types/Event';
import SearchIcon from '@mui/icons-material/Search';
import { GetModelItemsReferencing } from '../../../utils/ModelReferences';
import ItemTypeMenuResults from './ItemTypeMenuResults';
import { EMRALD_Model } from '../../../types/EMRALD_Model';
import { ExtSim } from '../../../types/ExtSim';
import { LogicNode } from '../../../types/LogicNode';
import { Variable } from '../../../types/Variable';

const SearchField = () => {
  const [value, setValue] = useState<string>('');
  const [openSearchDialog, setOpenSearchDialog] = useState<boolean>(false);
  const [diagrams, setDiagrams] = useState<Diagram[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [actions, setActions] = useState<Action[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const [selectedItem, setSelectedItem] = useState<Diagram | State | Action | Event | null>(null);
  const [extSims, setExtSims] = useState<ExtSim[]>([]);
  const [logicNodes, setLogicNodes] = useState<LogicNode[]>([]);
  const [variables, setVariables] = useState<Variable[]>([]);

  const onSubmit = () => {
    console.log('Search submitted:', value);
    // search through diagrams
    let tempDiagrams = getItemList(appData.value.DiagramList);
    setDiagrams(tempDiagrams);

    // search through states
    let tempStates = getItemList(appData.value.StateList);
    setStates(tempStates);

    // search through actions
    let tempActions = getItemList(appData.value.ActionList);
    setActions(tempActions);

    // search through events
    let tempEvents = getItemList(appData.value.EventList);
    setEvents(tempEvents);

    // search through ext sims
    let tempExtSims = getItemList(appData.value.ExtSimList);
    setExtSims(tempExtSims);

    //search for logic nodes
    let tempLogicNodes = getItemList(appData.value.LogicNodeList);
    setLogicNodes(tempLogicNodes);

    // search for variables
    let tempVariables = getItemList(appData.value.VariableList);
    setVariables(tempVariables);

    setOpenSearchDialog(true);
  };

  const getItemList = (list: any[]) => {
    let items: any = [];
    list.forEach((item) => {
      if (
        item.name.toLowerCase().includes(value.toLowerCase()) ||
        item.desc.toLowerCase().includes(value.toLowerCase())
      ) {
        items.push(item);
      }
    });
    return items;
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      onSubmit();
    }
  };

  const getModel = (item: Diagram | State | Action | Event, direction: any): ReactNode => {
    const [expandedItem, setExpandedItem] = useState<string | null>(null);
    const [nestedModel, setNestedModel] = useState<EMRALD_Model>();
    const ButtonString = direction === GetModelItemsReferencing ? 'Used by' : 'Using';

    const handleExpand = (item: Diagram | State | Action | Event) => {
      if (expandedItem === item.id) {
        setExpandedItem(null);
        return;
      }
      let tempModel = direction(item.name, item.objType, 1);
      setNestedModel(tempModel);
      setExpandedItem(item.id || null);
    };

    return (
      <>
        <Button onClick={() => handleExpand(item)} variant="contained">
          {expandedItem === item.id ? `Collapse ${ButtonString}` : `Expand ${ButtonString}`}
        </Button>
        {expandedItem === item.id && nestedModel && (
          <ItemTypeMenuResults
            diagrams={nestedModel.DiagramList}
            states={nestedModel.StateList}
            actions={nestedModel.ActionList}
            events={nestedModel.EventList}
            handleItemClick={handleItemClick}
            getModel={getModel}
            extSims={nestedModel.ExtSimList}
            logicNodes={nestedModel.LogicNodeList}
            variables={nestedModel.VariableList}
          />
        )}
      </>
    );
  };

  const handleItemClick = (event: any, item: any) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };
  const handleClose = () => {
    setOpenSearchDialog(false);
    setValue('');
    setDiagrams([]);
    setStates([]);
    setActions([]);
    setEvents([]);
    setExtSims([]);
    setLogicNodes([]);
    setVariables([]);
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
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={onSubmit}>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
          style: { marginRight: '50px', borderRadius: '15px' },
        }}
        onKeyDown={handleKeyDown}
      />
      <DialogComponent
        open={openSearchDialog}
        title={`Search Results for: ${value}`}
        onClose={handleClose}
        sx={{ width: '700px', fontWeight: 'bold' }}
      >
        <ItemTypeMenuResults
          diagrams={diagrams}
          states={states}
          actions={actions}
          events={events}
          handleItemClick={handleItemClick}
          getModel={getModel}
          extSims={extSims}
          logicNodes={logicNodes}
          variables={variables}
        />
      </DialogComponent>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => {}}>Edit Properties</MenuItem>
        <MenuItem onClick={() => {}}>Go to {selectedItem?.objType}</MenuItem>
      </Menu>
    </>
  );
};

export default SearchField;
