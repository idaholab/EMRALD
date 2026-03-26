import type {
  Action,
  Diagram,
  EMRALD_Model,
  Event,
  ExtSim,
  LogicNode,
  MainItemType,
  State,
  Variable,
} from '../../../../types/EMRALD_Model';
import type { ModelItem } from '../../../../types/ModelUtils';
import SearchIcon from '@mui/icons-material/Search';
import {
  Button,
  IconButton,
  InputAdornment,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import { useAlertContext } from '../../../../contexts/AlertContext';
import { useWindowContext } from '../../../../contexts/WindowContext';
import { appData } from '../../../../hooks/useAppData';
import {
  allMainItemTypes,
  GetModelItemsReferencedBy,
  GetModelItemsReferencing,
} from '../../../../utils/ModelReferences';
import SearchResultForm from '../../../forms/SearchResultForm/SearchResultForm';
import { ItemTypeMenuResults } from './ItemTypeMenuResults';

export const SearchField: React.FC = () => {
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  const [value, setValue] = useState('');

  const { addWindow } = useWindowContext();

  const onSubmit = () => {
    let tempAppData = structuredClone(appData.value);
    tempAppData = {
      ...tempAppData,
      DiagramList: getItemList(tempAppData.DiagramList),
      StateList: getItemList(tempAppData.StateList),
      ActionList: getItemList(tempAppData.ActionList),
      EventList: getItemList(tempAppData.EventList),
      ExtSimList: getItemList(tempAppData.ExtSimList),
      LogicNodeList: getItemList(tempAppData.LogicNodeList),
      VariableList: getItemList(tempAppData.VariableList),
    };
    addWindow(
      `Search Results for: ${value}`,
      <SearchResultForm model={tempAppData} getModel={getModel} />,
    );
    handleClose();
  };

  const getItemList = <T extends ModelItem>(list: T[]) => {
    const items: T[] = [];
    for (const item of list) {
      let desc = '';
      if (item.objType !== 'ExtSim') {
        desc = item.desc?.toLowerCase() ?? '';
      }
      if (
        item.name.toLowerCase().includes(value.toLowerCase())
        || desc.includes(value.toLowerCase())
      ) {
        items.push(structuredClone(item));
      }
      if (item.objType === 'LogicNode') {
        for (const compItem of item.compChildren) {
          if (
            compItem.diagramName.toLowerCase().includes(value.toLowerCase())
          ) {
            items.push(structuredClone(item));
          }
        }
      }
    }
    return items;
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      onSubmit();
    }
  };

  const getModel = (
    item: Diagram | State | Action | Event | ExtSim | LogicNode | Variable,
    buttonDirection: string,
  ) => {
    const [expandedItem, setExpandedItem] = useState<string | null>(null);
    const [nestedModel, setNestedModel] = useState<EMRALD_Model>();
    const { showAlert } = useAlertContext();

    const handleExpand = (
      item: Diagram | State | Action | Event | ExtSim | LogicNode | Variable,
    ) => {
      if (expandedItem === item.id) {
        setExpandedItem(null);
        return;
      }
      let tempModel: EMRALD_Model;
      try {
        tempModel
          = buttonDirection === 'Used By'
            ? GetModelItemsReferencing(
                item.name,
                item.objType as MainItemType,
                1,
              )
            : GetModelItemsReferencedBy(
                item.name,
                item.objType as MainItemType,
                1,
                allMainItemTypes,
                false,
              );
        tempModel = filterItemFromModel(tempModel, item);
        setNestedModel(tempModel);
        setExpandedItem(item.id ?? null);
      } catch (error) {
        console.error('Error Message:', error);
        showAlert('An error occurred getting the search items', 'error');
      }
    };
    const filterItemFromModel = (
      model: EMRALD_Model,
      item: Diagram | State | Action | Event | ExtSim | LogicNode | Variable,
    ) => {
      switch (item.objType) {
        case 'Diagram': {
          return {
            ...model,
            DiagramList: model.DiagramList.filter(
              diagram => diagram.id !== item.id,
            ),
          };
        }
        case 'State': {
          return {
            ...model,
            StateList: model.StateList.filter(state => state.id !== item.id),
          };
        }
        case 'Action': {
          return {
            ...model,
            ActionList: model.ActionList.filter(
              action => action.id !== item.id,
            ),
          };
        }
        case 'Event': {
          return {
            ...model,
            EventList: model.EventList.filter(event => event.id !== item.id),
          };
        }
        case 'ExtSim': {
          return {
            ...model,
            ExtSimList: model.ExtSimList.filter(
              extSim => extSim.id !== item.id,
            ),
          };
        }
        case 'LogicNode': {
          return {
            ...model,
            LogicNodeList: model.LogicNodeList.filter(
              logicNode => logicNode.id !== item.id,
            ),
          };
        }
        case 'Variable': {
          return {
            ...model,
            VariableList: model.VariableList.filter(
              variable => variable.id !== item.id,
            ),
          };
        }
        default: {
          return model;
        }
      }
    };

    return (
      <>
        <Button
          onClick={() => {
            handleExpand(item);
          }}
          variant="contained"
        >
          {expandedItem === item.id
            ? `Collapse ${buttonDirection}`
            : `Expand ${buttonDirection}`}
        </Button>
        {expandedItem === item.id && nestedModel && (
          <ItemTypeMenuResults model={nestedModel} getModel={getModel} />
        )}
      </>
    );
  };

  const handleClose = () => {
    setValue('');
  };

  return (
    <TextField
      id="search-field"
      variant="outlined"
      label="Search"
      value={value}
      onChange={e => {
        setValue(e.target.value);
      }}
      size="small"
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={onSubmit}>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
          style: {
            marginRight: isMediumScreen ? '15px' : '50px',
            maxWidth: isMediumScreen ? '150px' : '200px',
            borderRadius: '15px',
          },
        },
      }}
      onKeyDown={handleKeyDown}
    />
  );
};
