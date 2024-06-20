import { useState } from 'react';
import { useSignal } from '@preact/signals-react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useWindowContext } from '../../../contexts/WindowContext';
import {
  emptyLogicNode,
  useLogicNodeContext,
} from '../../../contexts/LogicNodeContext';
import { v4 as uuidv4 } from 'uuid';
import { CompChild, LogicNode } from '../../../types/LogicNode';
import { GateType, StateEvalValue } from '../../../types/ItemTypes';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { useDiagramContext } from '../../../contexts/DiagramContext';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import StateValuesTable from './StateValuesTable';
import TextField from '@mui/material/TextField';

interface LogicNodeFormProps {
  logicNodeData?: LogicNode;
  parentNodeName?: string;
  nodeType?: 'gate' | 'comp';
  gateType?: GateType;
  component?: string;
  editing?: boolean;
  isRoot?: boolean;
}

const LogicNodeForm: React.FC<LogicNodeFormProps> = ({
  logicNodeData,
  gateType,
  nodeType,
  component,
  editing,
  parentNodeName,
  isRoot,
}) => {
  const { handleClose, updateTitle } = useWindowContext();
  const { logicNodeList, createLogicNode, updateLogicNode } = useLogicNodeContext();
  const { diagrams } = useDiagramContext();
  const parentNode = logicNodeList.value.find((node) => node.name === parentNodeName);
  const logicNode = useSignal<LogicNode>(logicNodeData || parentNode || structuredClone(emptyLogicNode));
  const newLogicNode = useSignal<LogicNode>(structuredClone(emptyLogicNode));
  const compChildren = useSignal<CompChild[]>(logicNode.value.compChildren || []);
  const componentDiagrams =
    editing && component
      ? diagrams.filter(
          (diagram) =>
            diagram.diagramType === 'dtSingle' && diagram.name === component,
        )
      : diagrams.filter(
          (diagram) =>
            diagram.diagramType === 'dtSingle' &&
            !logicNode.value.compChildren.find(
              (child) => child.diagramName === diagram.name,
            ),
        );

  const currentNode = logicNode.value.compChildren.find((child) => child.diagramName === component);
  const [leafNodeType, setLeafNodeType] = useState<string | undefined>(nodeType);
  const [compDiagram, setCompDiagram] = useState<string>(component || '');
  const [defaultValues, setDefaultValues] = useState<boolean>(
    currentNode?.stateValues && currentNode.stateValues.length > 0
      ? false
      : true,
  );
  const [newCompChild, setNewCompChild] = useState<
    | {
        diagramName: string;
        stateValues?: { stateName: string; stateValue: StateEvalValue }[];
      }
    | undefined
  >();
  const [gateTypeValue, setGateTypeValue] = useState<GateType>(gateType || 'gtAnd');
  const [nameValue, setNameValue] = useState<string>(editing ? logicNode.value.name : '');
  const [descValue, setDescValue] = useState<string>(editing ? logicNode.value.desc : '');
  const [error, setError] = useState<boolean>(false);

  const gateTypeOptions = [
    {label: 'And', value: 'gtAnd'},
    {label: 'Or', value: 'gtOr'},
    {label: 'Not', value: 'gtNot'},
  ];

  // Add new comp child
  const handleAddNewCompChild = () => {
    if (newCompChild) {
      let newCompChildren = [...logicNode.value.compChildren, newCompChild];
      compChildren.value = newCompChildren;
      setNewCompChild(undefined); // Move this line inside the condition
    }
  };


  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setError(logicNodeList.value.some(node => node.name === newName));

    editing ? (logicNode.value.name = newName) : (newLogicNode.value.name = newName);
    setNameValue(newName);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    editing ? logicNode.value.desc = e.target.value : newLogicNode.value.desc = e.target.value;
    setDescValue(e.target.value);
  };

  const handleGateTypeChange = (e: SelectChangeEvent<"gtAnd" | "gtOr" | "gtNot">) => {
    editing ? logicNode.value.gateType = e.target.value as GateType : newLogicNode.value.gateType = e.target.value as GateType;
    setGateTypeValue(e.target.value as GateType);
  };

  const resetForm = () => {
    logicNode.value = {id: '', name: '', desc: '', gateType: 'gtAnd', compChildren: [], gateChildren: [], isRoot: false};
    newLogicNode.value = {id: '', name: '', desc: '', gateType: 'gtAnd', compChildren: [], gateChildren: [], isRoot: false};
    setLeafNodeType('');
    setCompDiagram('');
    setDefaultValues(true);
    setNewCompChild(undefined);
    setGateTypeValue('gtAnd');
    setNameValue('');
    setDescValue('');
    handleClose();
  };

  // Save logic node
  const handleSave = () => {
    updateTitle(logicNodeData?.name || '', logicNode.value.name);
    handleAddNewCompChild();
    if (isRoot) newLogicNode.value.isRoot = true;
    // Reset the stateValues if the defaultValues checkbox is checked
    if (defaultValues === true && currentNode && (currentNode?.stateValues?.length ?? 0) > 0) {
      currentNode.stateValues = [];
    }

    if (editing || nodeType === 'comp') {
      updateLogicNode({
        ...logicNode.value,
        gateType: gateTypeValue,
        compChildren: compChildren.value,
      })
    } else if (!editing && nodeType === 'gate' && parentNodeName) {
      newLogicNode.value.id = uuidv4();
      createLogicNode(newLogicNode.value);
      logicNode.value.gateChildren = [...logicNode.value.gateChildren, newLogicNode.value.name];
      updateLogicNode(logicNode.value);
    } else {
      newLogicNode.value.id = uuidv4();
      createLogicNode(newLogicNode.value);
    }
    resetForm();
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" my={3}>
        {logicNodeData ? 'Edit' : 'Create New'}{' '}
        {leafNodeType === 'comp' ? 'Component' : 'Gate'}
      </Typography>
      <form>
        {nodeType ? (
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

        {nodeType === 'comp' ? (
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
            {!defaultValues ? (
              <StateValuesTable
                diagramName={compDiagram}
                nodeDetails={currentNode}
              />
            ) : (
              <></>
            )}
          </>
        ) : (
          <>
            <FormControl
              variant="outlined"
              size="small"
              sx={{ minWidth: 120, width: '100%' }}
            >
              <InputLabel id="demo-simple-select-standard-label">
                Type
              </InputLabel>
              <Select
                labelId="type-select"
                id="type-select"
                value={gateTypeValue}
                onChange={handleGateTypeChange}
                label={'Type'}
              >
              {gateTypeOptions.map((option) => (
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
              inputProps={{ maxLength: 20 }}
              value={nameValue}
              onChange={handleNameChange}
              fullWidth
              error={error}
              helperText={`${ error ? "A Logic Node with this name already exists" : nameValue.length === 20 ? "Maximum 20 characters" : ""}`}
            />
            <TextField
              label="Description"
              variant="outlined"
              size="small"
              fullWidth
              multiline
              margin="normal"
              value={descValue}
              onChange={handleDescriptionChange}
            />
          </>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 5 }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ mr: 2 }}
            onClick={() => handleSave()}
            disabled={error}
          >
            Save
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleClose()}
          >
            Cancel
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default LogicNodeForm;
