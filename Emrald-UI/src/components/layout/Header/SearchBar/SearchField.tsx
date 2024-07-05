import { Button, IconButton, InputAdornment, Menu, MenuItem, TextField } from '@mui/material';
import { ReactNode, useState } from 'react';
import { DialogComponent } from '../../../common';
import { appData } from '../../../../hooks/useAppData';
import { Diagram } from '../../../../types/Diagram';
import { State } from '../../../../types/State';
import { Action } from '../../../../types/Action';
import { Event } from '../../../../types/Event';
import SearchIcon from '@mui/icons-material/Search';
import {
  GetModelItemsReferencedBy,
  GetModelItemsReferencing,
} from '../../../../utils/ModelReferences';
import ItemTypeMenuResults from './ItemTypeMenuResults';
import { EMRALD_Model } from '../../../../types/EMRALD_Model';
import { ExtSim } from '../../../../types/ExtSim';
import { LogicNode } from '../../../../types/LogicNode';
import { Variable } from '../../../../types/Variable';
import { useWindowContext } from '../../../../contexts/WindowContext';
import EventFormContextProvider from '../../../forms/EventForm/EventFormContext';
import EventForm from '../../../forms/EventForm/EventForm';
import StateForm from '../../../forms/StateForm/StateForm';
import ActionFormContextProvider from '../../../forms/ActionForm/ActionFormContext';
import ActionForm from '../../../forms/ActionForm/ActionForm';
import DiagramForm from '../../../forms/DiagramForm/DiagramForm';
import ExtSimForm from '../../../forms/ExtSimForm/ExtSimForm';
import LogicNodeForm from '../../../forms/LogicNodeForm/LogicNodeForm';
import VariableFormContextProvider from '../../../forms/VariableForm/VariableFormContext';
import VariableForm from '../../../forms/VariableForm/VariableForm';
import { MainItemTypes } from '../../../../types/ItemTypes';

const SearchField = () => {
  const [value, setValue] = useState<string>('');
  const [openSearchDialog, setOpenSearchDialog] = useState<boolean>(false);
  const [diagrams, setDiagrams] = useState<Diagram[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [actions, setActions] = useState<Action[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const [selectedItem, setSelectedItem] = useState<
    Diagram | State | Action | Event | ExtSim | LogicNode | Variable | null
  >(null);
  const [extSims, setExtSims] = useState<ExtSim[]>([]);
  const [logicNodes, setLogicNodes] = useState<LogicNode[]>([]);
  const [variables, setVariables] = useState<Variable[]>([]);

  const { addWindow } = useWindowContext();

  const onSubmit = () => {
    let tempAppData = structuredClone(appData.value);
    // search through diagrams
    let tempDiagrams = getItemList(tempAppData.DiagramList);
    setDiagrams(tempDiagrams);
    // search through states
    let tempStates = getItemList(tempAppData.StateList);
    setStates(tempStates);
    // search through actions
    let tempActions = getItemList(tempAppData.ActionList);
    setActions(tempActions);
    // search through events
    let tempEvents = getItemList(tempAppData.EventList);
    setEvents(tempEvents);
    // search through ext sims
    let tempExtSims = getItemList(tempAppData.ExtSimList);
    setExtSims(tempExtSims);
    //search for logic nodes
    let tempLogicNodes = getItemList(tempAppData.LogicNodeList);
    setLogicNodes(tempLogicNodes);
    // search for variables
    let tempVariables = getItemList(tempAppData.VariableList);
    setVariables(tempVariables);
    setOpenSearchDialog(true);
  };

  const getItemList = (list: any[]) => {
    let items: any = [];
    list.forEach((item) => {
      if (
        item.name.toLowerCase().includes(value.toLowerCase()) ||
        item.desc?.toLowerCase().includes(value.toLowerCase())
      ) {
        items.push(structuredClone(item));
      }
    });
    return items;
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      onSubmit();
    }
  };

  const getModel = (
    item: Diagram | State | Action | Event | ExtSim | LogicNode | Variable,
    direction: typeof GetModelItemsReferencing | typeof GetModelItemsReferencedBy,
  ): ReactNode => {
    const [expandedItem, setExpandedItem] = useState<string | null>(null);
    const [nestedModel, setNestedModel] = useState<EMRALD_Model>();
    const ButtonString = direction === GetModelItemsReferencing ? 'Used by' : 'Using';

    const handleExpand = (
      item: Diagram | State | Action | Event | ExtSim | LogicNode | Variable,
    ) => {
      if (expandedItem === item.id) {
        setExpandedItem(null);
        return;
      }
      let tempModel = direction(item.name, item.objType as MainItemTypes, 1);
      tempModel = filterItemFromModel(tempModel, item);
      setNestedModel(tempModel);
      setExpandedItem(item.id || null);
    };
    const filterItemFromModel = (
      model: EMRALD_Model,
      item: Diagram | State | Action | Event | ExtSim | LogicNode | Variable,
    ): EMRALD_Model => {
      switch (item.objType) {
        case 'Diagram':
          return {
            ...model,
            DiagramList: model.DiagramList?.filter((diagram) => diagram.id !== item.id),
          };
        case 'State':
          return {
            ...model,
            StateList: model.StateList?.filter((state) => state.id !== item.id),
          };
        case 'Action':
          return {
            ...model,
            ActionList: model.ActionList?.filter((action) => action.id !== item.id),
          };
        case 'Event':
          return {
            ...model,
            EventList: model.EventList?.filter((event) => event.id !== item.id),
          };
        case 'ExtSim':
          return {
            ...model,
            ExtSimList: model.ExtSimList?.filter((extSim) => extSim.id !== item.id),
          };
        case 'LogicNode':
          return {
            ...model,
            LogicNodeList: model.LogicNodeList?.filter((logicNode) => logicNode.id !== item.id),
          };
        case 'Variable':
          return {
            ...model,
            VariableList: model.VariableList?.filter((variable) => variable.id !== item.id),
          };
        default:
          return model;
      }
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
  const goToEditProperties = () => {
    const componentMap: Record<
      MainItemTypes,
      (data: Diagram | State | Action | Event | ExtSim | LogicNode | Variable) => JSX.Element
    > = {
      Diagram: (data) => <DiagramForm diagramData={data as Diagram} />,
      State: (data) => <StateForm stateData={data as State} />,
      Action: (data) => (
        <ActionFormContextProvider>
          <ActionForm actionData={data as Action} />
        </ActionFormContextProvider>
      ),
      Event: (data) => (
        <EventFormContextProvider>
          <EventForm eventData={data as Event} />
        </EventFormContextProvider>
      ),
      ExtSim: (data) => <ExtSimForm ExtSimData={data as ExtSim} />,
      LogicNode: (data) => <LogicNodeForm logicNodeData={data as LogicNode} editing />,
      Variable: (data) => (
        <VariableFormContextProvider>
          <VariableForm variableData={data as Variable} />
        </VariableFormContextProvider>
      ),
      EMRALD_Model: () => <></>,
    };

    if (selectedItem?.objType && componentMap[selectedItem.objType]) {
      addWindow(`Edit ${selectedItem?.name}`, componentMap[selectedItem.objType](selectedItem));
    }

    handleMenuClose();
    handleClose();
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
        <MenuItem onClick={goToEditProperties}>Edit Properties</MenuItem>
        {selectedItem?.objType === 'Diagram' && (
          <MenuItem onClick={goToEditProperties}>Go To Diagram</MenuItem>
        )}
      </Menu>
    </>
  );
};

export default SearchField;
