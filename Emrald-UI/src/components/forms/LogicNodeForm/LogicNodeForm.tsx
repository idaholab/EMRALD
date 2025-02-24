import { Dispatch, SetStateAction, useEffect } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { LogicNode } from '../../../types/LogicNode';
import { GateType, MainItemTypes } from '../../../types/ItemTypes';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import StateValuesTable from './StateValuesTable';
import TextField from '@mui/material/TextField';
import { useLogicNodeFormContext } from './LogicNodeFormContext';
import MainDetailsForm from '../MainDetailsForm';

interface LogicNodeFormProps {
  logicNodeData?: LogicNode;
  parentNodeName?: string;
  nodeType?: 'gate' | 'comp';
  gateType?: GateType;
  component?: string;
  editing?: boolean;
  setAsRoot?: boolean;
}

const LogicNodeForm: React.FC<LogicNodeFormProps> = ({
  logicNodeData,
  gateType,
  nodeType,
  component,
  editing,
  parentNodeName,
  setAsRoot,
}) => {
  const {
    name,
    desc,
    gateTypeValue,
    leafNodeType,
    compDiagram,
    componentDiagrams,
    defaultValues,
    currentNode,
    gateTypeOptions,
    isRoot,
    hasError,
    setDesc,
    setLeafNodeType,
    setCompDiagram,
    setNewCompChild,
    setDefaultValues,
    setCurrentNodeStateValues,
    setGateTypeValue,
    setIsRoot,
    handleNameChange,
    handleSave,
    handleClose,
    availableAsTopOrSubtree,
    checkForDuplicateNames,
    initializeForm,
  } = useLogicNodeFormContext();

  useEffect(() => {
      initializeForm(logicNodeData, editing, component, parentNodeName, nodeType, gateType);
    }, []);

  return (
    <Box mx={3} pb={3}>
      <Typography variant="h5" my={3}>
        {logicNodeData ? 'Edit' : 'Create New'} {leafNodeType === 'comp' ? 'Component' : 'Gate'}
      </Typography>
      <form>
        {leafNodeType ? (
          <>
            {!editing ? (
              <>
                <FormControl
                  variant="outlined"
                  size="small"
                  sx={{ minWidth: 120, width: '100%', mb: 3 }}
                >
                  <InputLabel id="node-type-select-label">Node Type</InputLabel>
                  <Select
                    labelId="node-type-select-label"
                    id="node-type-select"
                    value={leafNodeType}
                    onChange={(event: SelectChangeEvent<string>) =>
                      setLeafNodeType(event.target.value)
                    }
                    label="Node Type"
                  >
                    <MenuItem key={'gate'} value="gate">
                      Gate
                    </MenuItem>
                    <MenuItem key={'comp'} value="comp">
                      Component
                    </MenuItem>
                  </Select>
                </FormControl>
                <Divider sx={{ mb: 3 }} />
              </>
            ) : (
              <></>
            )}
          </>
        ) : (
          <></>
        )}

        {leafNodeType === 'comp' ? (
          <>
            <FormControl
              variant="outlined"
              size="small"
              sx={{ minWidth: 120, width: '100%', mb: 3 }}
            >
              <InputLabel id="comp-select-label">Component Diagrams</InputLabel>
              <Select
                labelId="node-type-select-label"
                id="node-type-select"
                value={compDiagram}
                onChange={(event: SelectChangeEvent<string>) => {
                  setCompDiagram(event.target.value);
                  if (!component) {
                    setNewCompChild({
                      diagramName: event.target.value,
                      stateValues: [],
                    });
                  }
                }}
                disabled={editing}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 200,
                    },
                  },
                }}
                label="Component Diagrams"
              >
                {componentDiagrams.map((diagram) => (
                  <MenuItem key={diagram.id} value={diagram.name}>
                    {diagram.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {compDiagram ? (
              <FormControlLabel
                sx={{ mb: 2 }}
                control={
                  <Checkbox
                    checked={defaultValues}
                    value={defaultValues}
                    onChange={(e) => setDefaultValues(e.target.checked)}
                  />
                }
                label="Use default diagram values"
              />
            ) : (
              <></>
            )}
            {!defaultValues ? <StateValuesTable componentNode={currentNode} setCurrentNodeStateValues={setCurrentNodeStateValues}/> : <></>}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 5 }}>
              <Button
                variant="contained"
                color="primary"
                sx={{ mr: 2 }}
                onClick={() => handleSave()}
                disabled={hasError}
              >
                Save
              </Button>
              <Button variant="contained" color="secondary" onClick={() => handleClose()}>
                Cancel
              </Button>
            </Box>
          </>
        ) : (
          <>
            <MainDetailsForm
              itemType={MainItemTypes.LogicNode}
              type={gateTypeValue}
              setType={setGateTypeValue as Dispatch<SetStateAction<GateType>>}
              typeOptions={gateTypeOptions}
              name={name}
              handleNameChange={handleNameChange}
              desc={desc}
              setDesc={setDesc}
              nameError={checkForDuplicateNames()}
              error={hasError}
              errorMessage="An node with this name already exists, or includes an invalid character."
              handleSave={() => handleSave()}
              reqPropsFilled={name && gateType ? true : false}
            >
              <>
              {
              !setAsRoot && (
                <FormControlLabel
                  label="Make available as Top or Subtree"
                  disabled={availableAsTopOrSubtree()}
                  control={
                    <Checkbox
                      checked={isRoot ? true : false}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIsRoot(e.target.checked)}
                    />
                  }
                />
              )
            }
              </>
            </MainDetailsForm>
          </>
        )}
      </form>
    </Box>
  );
};

export default LogicNodeForm;
