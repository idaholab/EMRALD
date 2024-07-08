import { Button, IconButton, InputAdornment, Menu, MenuItem, TextField } from '@mui/material';
import { ReactNode, useState } from 'react';
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
import EmraldDiagram from '../../../diagrams/EmraldDiagram/EmraldDiagram';
import { useDiagramContext } from '../../../../contexts/DiagramContext';
import LogicNodeTreeDiagram from '../../../diagrams/LogicTreeDiagram/LogicTreeDiagram';
import SearchResultForm from '../../../forms/SearchResultForm/searchResultForm';

const SearchField = () => {
  const [value, setValue] = useState<string>('');
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const [selectedItem, setSelectedItem] = useState<
    Diagram | State | Action | Event | ExtSim | LogicNode | Variable | null
  >(null);
  const { getDiagramByDiagramName } = useDiagramContext();

  const { addWindow } = useWindowContext();

  const onSubmit = () => {
    let tempAppData = structuredClone(appData.value);
    // search through diagrams
    let diagrams = getItemList(tempAppData.DiagramList);

    // search through states
    let states = getItemList(tempAppData.StateList);
    // search through actions
    let actions = getItemList(tempAppData.ActionList);
    // search through events
    let events = getItemList(tempAppData.EventList);
    // search through ext sims
    let extSims = getItemList(tempAppData.ExtSimList);
    //search for logic nodes
    let logicNodes = getItemList(tempAppData.LogicNodeList);
    // search for variables
    let variables = getItemList(tempAppData.VariableList);
    // setOpenSearchDialog(true);
    addWindow(
      `Search Results for: ${value}`,
      <SearchResultForm
        diagrams={diagrams}
        states={states}
        actions={actions}
        events={events}
        extSims={extSims}
        logicNodes={logicNodes}
        variables={variables}
        handleItemClick={handleItemClick}
        getModel={getModel}
      />,
    );
    handleClose();
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
  };
  const goToDiagramStateorLogictree = () => {
    const componentMap: Record<
      MainItemTypes.LogicNode | MainItemTypes.Diagram | MainItemTypes.State,
      (data: Diagram | State | LogicNode) => JSX.Element
    > = {
      Diagram: (data): JSX.Element => <EmraldDiagram diagram={data as Diagram} />,
      State: (data) => {
        const d = data as State;
        const stateDiagram = getDiagramByDiagramName(d.diagramName);
        return <EmraldDiagram diagram={stateDiagram as Diagram} />;
      },
      LogicNode: (data) => <LogicNodeTreeDiagram logicNode={data as LogicNode} />,
    };

    if (selectedItem?.objType) {
      addWindow(
        selectedItem.name,
        componentMap[selectedItem.objType as 'Diagram' | 'State' | 'LogicNode'](
          selectedItem as any,
        ),
        {
          x: 75,
          y: 25,
          width: 1300,
          height: 700,
        },
      );
      handleMenuClose();
      handleClose();
    }
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };
  const handleClose = () => {
    setValue('');
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
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={goToEditProperties}>Edit Properties</MenuItem>
        {(selectedItem?.objType === 'Diagram' || selectedItem?.objType === 'State') && (
          <MenuItem onClick={goToDiagramStateorLogictree}>Go To: {selectedItem?.name}</MenuItem>
        )}
      </Menu>
    </>
  );
};

export default SearchField;
