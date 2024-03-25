import { useEffect, useState } from 'react';
import { signal, useSignal } from '@preact/signals';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useWindowContext } from '../../../contexts/WindowContext';
import { emptyLogicNode, useLogicNodeContext } from '../../../contexts/LogicNodeContext';
import { v4 as uuidv4 } from 'uuid';
import MainDetailsForm from '../../forms/MainDetailsForm';
import { LogicNode } from '../../../types/LogicNode';
import { GateType, StateEvalValue } from '../../../types/ItemTypes';
import { appData } from '../../../hooks/useAppData';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { useDiagramContext } from '../../../contexts/DiagramContext';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import StateValuesTable from './StateValuesTable';

interface LogicNodeFormProps {
  logicNodeData?: LogicNode;
  parentNodeName?: string;
  nodeType?: "gate" | "comp";
  gateType?: GateType;
  component?: string;
  editing?: boolean;
}

const LogicNodeForm: React.FC<LogicNodeFormProps> = ({ logicNodeData, gateType, nodeType, component, editing, parentNodeName }) => {
  const {handleClose, updateTitle } = useWindowContext();
  const {logicNodes, createLogicNode, updateLogicNode} = useLogicNodeContext();
  const { diagrams } = useDiagramContext();
  const componentDiagrams = diagrams.filter((diagram) => diagram.diagramType === 'dtSingle');
  const parentNode = logicNodes?.find((node) => node.name === parentNodeName);

  // const logicNode = useSignal<LogicNode>(logicNodeData || parentNode || emptyLogicNode);
  // const leafNodeType = useSignal<string | undefined>(nodeType);
  // const compDiagram = useSignal<string>(component || '');
  // const defaultValues = useSignal<boolean>(true);
  // const type = useSignal<GateType>(logicNode.value.gateType || gateType || 'gtAnd');
  // const name = useSignal<string>(logicNode.value.name || '');
  // const desc = useSignal<string>(logicNode.value.desc || '');
  // const isRoot = useSignal<boolean>(logicNode.value.isRoot !== undefined ? logicNode.value.isRoot : parentNodeName ? false : true);
  // const gateChildren = useSignal<string[]>(logicNode.value.gateChildren || []);
  // const compChildren = useSignal<{diagramName: string, stateValues?: {stateName: string, stateValue: StateEvalValue}[]}[]>(logicNode.value.compChildren || []);
  // const newCompChild = useSignal<{diagramName: string, stateValues?: {stateName: string, stateValue: StateEvalValue}[]} | undefined>(undefined);

  const [logicNode, setLogicNode] = useState<LogicNode>(logicNodeData || parentNode || emptyLogicNode);
  const [leafNodeType, setLeafNodeType] = useState<string | undefined>(nodeType);
  const [compDiagram, setCompDiagram] = useState<string>(component || '');
  const [defaultValues, setDefaultValues] = useState<boolean>(true);
  const [type, setType] = useState<GateType>(logicNode?.gateType || gateType || 'gtAnd');
  const [name, setName] = useState<string>(logicNode?.name || '');
  const [desc, setDesc] = useState<string>(logicNode?.desc || '');
  const [isRoot, setIsRoot] = useState<boolean>(logicNode?.isRoot !== undefined ? logicNode.isRoot : parentNodeName ? false : true);
  const [gateChildren, setGateChildren] = useState<string[]>(logicNode?.gateChildren || []);
  const [compChildren, setCompChildren] = useState<{diagramName: string, stateValues?: {stateName: string, stateValue: StateEvalValue}[]}[]>(logicNode?.compChildren || []);
  const [newCompChild, setNewCompChild] = useState<{diagramName: string, stateValues?: {stateName: string, stateValue: StateEvalValue}[]} | undefined>();

  const currentNode = logicNodeData?.compChildren.find((child) => child.diagramName === compDiagram);

  useEffect(() => {
    console.log(logicNode);
  }, [logicNode, compChildren]);

  const handleAddNewCompChild = () => {
    if (newCompChild) {
      let newCompChildren = [...compChildren, newCompChild];
      console.log(newCompChildren);
      setCompChildren(newCompChildren);
      setNewCompChild(undefined); // Move this line inside the condition
    }
};


  const handleSave = () => {
    updateTitle(logicNodeData?.name || '', name);

    handleAddNewCompChild();

    const newLogicNode = {
      id: uuidv4(),
      name: name,
      desc: desc,
      gateType: type,
      compChildren: compChildren,
      gateChildren: gateChildren,
      isRoot: isRoot
    } 

    logicNode
      ? updateLogicNode({
          ...logicNode,
          id: logicNode.id,
          name: name,
          desc: desc,
          gateType: type,
          compChildren: compChildren,
          gateChildren: gateChildren,
          isRoot: isRoot
        })
      : createLogicNode(newLogicNode);
    handleClose();
  };


  return (
    <Container maxWidth="sm">
      <Typography variant="h5" my={3}>
        {logicNodeData ? 'Edit' : 'Create New'} {leafNodeType === 'comp' ? 'Component' : 'Gate'}
      </Typography>
      <form>
        {nodeType ? (
          <>
          {
            !editing ? (
              <>
              <FormControl
                variant="outlined"
                size="small"
                sx={{ minWidth: 120, width: '100%', mb: 3 }}
              >
                <InputLabel id="node-type-select-label">
                  Node Type
                </InputLabel>
                <Select
                  labelId="node-type-select-label"
                  id="node-type-select"
                  value={leafNodeType}
                  onChange={(event: SelectChangeEvent<string>) => setLeafNodeType(event.target.value)}
                  label='Node Type'
                >
                  <MenuItem key={'gate'} value='gate'>
                    Gate
                  </MenuItem>
                  <MenuItem key={'comp'} value='comp'>
                    Component
                  </MenuItem>
                </Select>
              </FormControl>
              <Divider sx={{ mb: 3 }} />
              </>
            ) : (<></>)
          }
          </>
        ) : (<></>)}

        { nodeType === 'comp' ? (
          <>
    
          <FormControl
            variant="outlined"
            size="small"
            sx={{ minWidth: 120, width: '100%', mb: 3 }}
          >
            <InputLabel id="comp-select-label">
              Component Diagrams
            </InputLabel>
            <Select
              labelId="node-type-select-label"
              id="node-type-select"
              value={compDiagram}
              onChange={(event: SelectChangeEvent<string>) => {
                setCompDiagram(event.target.value);
                if (!component) {
                  setNewCompChild({diagramName: event.target.value, stateValues: []});
                }
              }}
              MenuProps={{
                PaperProps: {
                    style: {
                        maxHeight: 200,
                    },
                },
            }}
              label='Component Diagrams'
            >
              {
                componentDiagrams.map((diagram) => (
                  <MenuItem key={diagram.id} value={diagram.name}>
                    {diagram.name}
                  </MenuItem>
                ))
              }
            </Select>
          </FormControl>
          {
            compDiagram ? (
              <FormControlLabel sx={{mb: 2}} control={<Checkbox defaultChecked value={defaultValues} onChange={(e) => setDefaultValues(e.target.checked)} />} label="Use default diagram values" />
            ) : (<></>)
          }
          {
            !defaultValues ? (
              <StateValuesTable diagramName={compDiagram} nodeDetails={currentNode} />
            ) : (<></>)
          } 
          </>
        ) : (<>
          {/* <MainDetailsForm 
            typeLabel='Gate Type'
            type={type.value}
            setType={setType}
            typeOptions={[
              {value: 'gtAnd', label: 'And'},
              {value: 'gtOr', label: 'Or'},
              {value: 'gtNot', label: 'Not'},
            ]}
            name={name.value}
            setName={setName}
            desc={desc.value}
            setDesc={setDesc}
          /> */}
        </>)}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 5 }}>
          <Button variant="contained" color="primary" sx={{ mr: 2 }} onClick={() => handleSave()}>
            Save
          </Button>
          <Button variant="contained" color="secondary" onClick={() => handleClose()}>
            Cancel
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default LogicNodeForm;
