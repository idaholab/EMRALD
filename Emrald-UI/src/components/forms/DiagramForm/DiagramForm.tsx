import React, { useMemo } from 'react';
import { useState } from 'react';
import { useSignal } from '@preact/signals-react';
import Typography from '@mui/material/Typography';
import MainDetailsForm from '../../forms/MainDetailsForm';
import { v4 as uuidv4 } from 'uuid';
import { Diagram } from '../../../types/Diagram';
import { DiagramType, MainItemTypes } from '../../../types/ItemTypes';
import { emptyDiagram, useDiagramContext } from '../../../contexts/DiagramContext';
import { useWindowContext } from '../../../contexts/WindowContext';
import {
  Alert,
  Box,
  Button,
  FormControl,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Tab,
  Tabs,
  TextField,
} from '@mui/material';
import { useAppData } from '../../../hooks/useAppData';
import GroupListItems from '../../common/GroupListItems';
import { EMRALD_Model } from '../../../types/EMRALD_Model';
import { useTemplateContext } from '../../../contexts/TemplateContext';
import { FileUploadComponent, TabPanel } from '../../common';
import CloseIcon from '@mui/icons-material/Close';
import ImportForm from '../ImportForm/ImportForm';

interface DiagramFormProps {
  diagramData?: Diagram;
}

const DiagramForm: React.FC<DiagramFormProps> = ({ diagramData }) => {
  const { activeWindowId, handleClose, updateTitle, addWindow } = useWindowContext();
  const { updateDiagram, createDiagram } = useDiagramContext();
  const { findTemplatesByGroupName } = useTemplateContext();
  const diagram = useSignal<Diagram>(diagramData || emptyDiagram);
  const [name, setName] = useState<string>(diagramData?.name || '');
  const [desc, setDesc] = useState<string>(diagramData?.desc || '');
  const [diagramType, setDiagramType] = useState<DiagramType>(
    diagramData?.diagramType || 'dtSingle',
  );
  const [hasError, setHasError] = useState<boolean>(false);

  const diagramTypeOptions = [
    { value: 'dtSingle', label: 'Single State (Evaluation)' },
    { value: 'dtMulti', label: 'Multi State' },
  ];
  const [diagramLabel, setDiagramLabel] = useState<string>(diagramData?.diagramLabel || '');
  const diagrams = useAppData().appData.value.DiagramList;
  const [importDiagram, setImportDiagram] = useState<EMRALD_Model>();
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<EMRALD_Model>();
  const groupTemplates = useMemo(() => findTemplatesByGroupName(selectedGroup), [selectedGroup]);
  const [currentTab, setCurrentTab] = React.useState(0);
  const [formWindowId] = useState<string | null>(activeWindowId);

  const handleSave = () => {
    if (selectedTemplate && formWindowId) {
      addWindow(
        `Import Diagram: ${selectedTemplate.name}`,
        <ImportForm importedData={selectedTemplate} fromTemplate={true}/>,
        {
          x: 75,
          y: 25,
          width: 1300,
          height: 750,
        },
        null,
        formWindowId,
      );
    } else if (importDiagram) {
    } else {
      updateTitle(diagramData?.name || '', name);

      if (diagramData) {
        updateDiagram({
          ...diagram.value,
          name,
          desc,
          diagramType,
          diagramLabel,
        });
      } else {
        createDiagram({
          ...diagram.value,
          id: uuidv4(),
          name,
          desc,
          diagramType,
          diagramLabel: diagramLabel || 'Component',
        });
      }
      handleClose();
    }
  };

  const reset = () => {
    setName(diagramData?.name || '');
    setDesc(diagramData?.desc || '');
    setDiagramType(diagramData?.diagramType || 'dtSingle');
    setDiagramLabel(diagramData?.diagramLabel || '');
  };

  const handleImport = (model: EMRALD_Model) => {
    setImportDiagram(model);
    setSelectedTemplate(undefined);
    reset();
  };
  const handleNameChange = (newName: string) => {
    setHasError(diagrams.some((node) => node.name === newName));
    setName(newName);
  };

  const handleTabChange = (_event: React.SyntheticEvent, tabValue: number) => {
    setCurrentTab(tabValue);
  };

  return (
    <Box mx={3} pb={3}>
      <Box mt={3}>
        {diagramData ? (
          <Tabs value={currentTab} onChange={handleTabChange} aria-label="basic tabs example">
            <Tab label={`${diagramData ? 'Edit' : 'Create'} Diagram`} />
          </Tabs>
        ) : (
          <Tabs value={currentTab} onChange={handleTabChange} aria-label="basic tabs example">
            <Tab label={`${diagramData ? 'Edit' : 'Create'} Diagram`} />
            <Tab label="Import Diagram" />
            <Tab label="From Template" />
          </Tabs>
        )}
      </Box>

      <TabPanel value={currentTab} index={0}>
        {importDiagram || selectedTemplate ? (
          <Alert sx={{ mb: 3, width: '75%' }} severity="warning" variant="outlined">
            Form fields are disabled when a imported diagram or template is selected. To change
            these values, please remove the imported diagram or template.
          </Alert>
        ) : (
          <></>
        )}
        <form>
          <MainDetailsForm
            itemType={MainItemTypes.Diagram}
            type={diagramType}
            setType={setDiagramType}
            typeOptions={diagramTypeOptions}
            typeDisabled={!!selectedTemplate || !!importDiagram}
            nameDisabled={!!selectedTemplate || !!importDiagram}
            descDisabled={!!selectedTemplate || !!importDiagram}
            name={name}
            desc={desc}
            setDesc={setDesc}
            handleSave={handleSave}
            reset={reset}
            handleNameChange={handleNameChange}
            error={hasError}
            errorMessage="A Diagram with this name already exists."
            reqPropsFilled={
              name && diagramLabel && !selectedTemplate && !importDiagram ? true : false
            }
          >
            <FormControl variant="outlined" size="small" sx={{ minWidth: 120, width: '100%' }}>
              <TextField
                label="Diagram Label"
                margin="normal"
                variant="outlined"
                size="small"
                disabled={!!selectedTemplate || !!importDiagram}
                sx={{ mb: 0 }}
                value={diagramLabel}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setDiagramLabel(e.target.value)
                }
                fullWidth
              />
            </FormControl>
          </MainDetailsForm>
        </form>
      </TabPanel>
      <TabPanel value={currentTab} index={1}>
        <Box>
          {selectedTemplate ? (
            <Alert sx={{ mb: 3 }} severity="warning" variant="outlined">
              The selected template will be ignored when using an imported diagram.
            </Alert>
          ) : (
            <></>
          )}
          <Box ml={3}>
            <FileUploadComponent label="Choose File" file={importDiagram} setFile={handleImport} />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 5 }}>
            <Button variant="contained" color="primary" sx={{ mr: 2 }} onClick={() => handleSave()}>
              Save
            </Button>
            <Button variant="contained" color="secondary" onClick={() => handleClose()}>
              Cancel
            </Button>
          </Box>
        </Box>
      </TabPanel>
      <TabPanel value={currentTab} index={2}>
        {importDiagram && selectedTemplate ? (
          <Alert sx={{ mb: 3 }} severity="warning" variant="outlined">
            Imported diagram will be ignored when using a template.
          </Alert>
        ) : (
          <></>
        )}
        <Box>
          <Box ml={3} mb={3} flex={1}>
            <Typography variant="subtitle1">
              Selected Group: <b>{selectedGroup}</b>
              {selectedGroup ? (
                <IconButton
                  aria-label="close"
                  onClick={() => setSelectedGroup('')}
                  sx={{
                    color: (theme) => theme.palette.grey[500],
                    ml: 6,
                  }}
                >
                  <CloseIcon />
                </IconButton>
              ) : (
                <></>
              )}
            </Typography>
            <Typography variant="subtitle1">
              Selected Template: <b>{selectedTemplate?.name}</b>
              {selectedTemplate ? (
                <IconButton
                  aria-label="close"
                  onClick={() => setSelectedTemplate(undefined)}
                  sx={{
                    color: (theme) => theme.palette.grey[500],
                    ml: 6,
                  }}
                >
                  <CloseIcon />
                </IconButton>
              ) : (
                <></>
              )}
            </Typography>
          </Box>

          <Box display="flex">
            <Box ml={3} flex={1}>
              <GroupListItems selectedGroup={selectedGroup} setSelectedGroup={setSelectedGroup} />
            </Box>
            <Box ml={3} flex={1}>
              <List
                sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                aria-label="contacts"
              >
                {groupTemplates &&
                  groupTemplates.map((template) => (
                    <ListItem disablePadding key={template.name}>
                      <ListItemButton
                        sx={{
                          backgroundColor:
                            template.name === selectedTemplate?.name ? 'lightgreen' : 'white',
                        }}
                        onClick={() => {
                          setSelectedTemplate(template);
                          reset();
                        }}
                      >
                        {template.name}
                      </ListItemButton>
                    </ListItem>
                  ))}
              </List>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 5 }}>
            <Button
              variant="contained"
              color="primary"
              sx={{ mr: 2 }}
              disabled={!selectedTemplate}
              onClick={() => handleSave()}
            >
              Save
            </Button>
            <Button variant="contained" color="secondary" onClick={() => handleClose()}>
              Cancel
            </Button>
          </Box>
        </Box>
      </TabPanel>
    </Box>
  );
};

export default DiagramForm;
