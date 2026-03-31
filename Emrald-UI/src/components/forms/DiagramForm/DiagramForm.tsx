import type {
  Diagram,
  DiagramType,
  EMRALD_Model,
} from '../../../types/EMRALD_Model';
import CloseIcon from '@mui/icons-material/Close';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Tab,
  Tabs,
  TextField,
  type Theme,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import { useSignal } from '@preact/signals-react';
import { useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  emptyDiagram,
  useDiagramContext,
} from '../../../contexts/DiagramContext';
import { useTemplateContext } from '../../../contexts/TemplateContext';
import { useWindowContext } from '../../../contexts/WindowContext';
import { appData } from '../../../hooks/useAppData';
import { upgradeModel } from '../../../utils/Upgrades/upgrade';
import { FileUploadComponent, TabPanel } from '../../common';
import { GroupListItems } from '../../common/GroupListItems';
import { MainDetailsForm } from '../../forms/MainDetailsForm';
import { ImportForm } from '../ImportForm/ImportForm';

interface DiagramFormProps {
  diagramData?: Diagram;
}

export const DiagramForm: React.FC<DiagramFormProps> = ({ diagramData }) => {
  const { activeWindowId, handleClose, updateTitle, addWindow }
    = useWindowContext();
  const { updateDiagram, createDiagram } = useDiagramContext();
  const { findTemplatesByGroupName } = useTemplateContext();
  const diagram = useSignal(diagramData ?? emptyDiagram);
  const [name, setName] = useState(diagramData?.name ?? '');
  const [originalName] = useState(diagramData?.name);
  const [desc, setDesc] = useState(diagramData?.desc ?? '');
  const [diagramType, setDiagramType] = useState<DiagramType>(
    diagramData?.diagramType ?? 'dtMulti',
  );
  const [hasError, setHasError] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string>();

  const diagramTypeOptions = [
    { value: 'dtSingle', label: 'Single State (Evaluation)' },
    { value: 'dtMulti', label: 'Multi State' },
  ];
  const [diagramLabel, setDiagramLabel] = useState(
    diagramData?.diagramLabel ?? '',
  );
  const diagrams = appData.value.DiagramList;
  const diagramLabelsSet = new Set(diagrams.map(d => d.diagramLabel));
  const diagramLabels = Array.from(diagramLabelsSet);
  const [importDiagram, setImportDiagram] = useState<EMRALD_Model>();
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<EMRALD_Model>();
  const groupTemplates = useMemo(
    () => findTemplatesByGroupName(selectedGroup),
    [selectedGroup],
  );
  const [currentTab, setCurrentTab] = useState(0);
  const [formWindowId] = useState(activeWindowId);

  const handleSave = () => {
    if (selectedTemplate && formWindowId) {
      addWindow(
        `Import Diagram: ${selectedTemplate.name ?? ''}`,
        <ImportForm importedData={selectedTemplate} fromTemplate={true} />,
        {
          x: 75,
          y: 25,
          width: 1300,
          height: 750,
        },
        null,
        formWindowId,
      );
    } else if (importDiagram && formWindowId) {
      addWindow(
        `Import Diagram: ${importDiagram.name ?? ''}`,
        <ImportForm importedData={importDiagram} fromTemplate={true} />,
        {
          x: 75,
          y: 25,
          width: 1300,
          height: 750,
        },
        null,
        formWindowId,
      );
    } else {
      updateTitle(diagramData?.name ?? '', name);

      if (diagramData) {
        updateDiagram({
          ...diagram.value,
          name: name.trim(),
          desc,
          diagramType,
          diagramLabel,
        });
      } else {
        createDiagram({
          ...diagram.value,
          id: uuidv4(),
          name: name.trim(),
          desc,
          diagramType,
          diagramLabel: diagramLabel || 'Component',
        });
      }
      handleClose();
    }
  };

  const reset = () => {
    setName(diagramData?.name ?? '');
    setDesc(diagramData?.desc ?? '');
    setDiagramType(diagramData?.diagramType ?? 'dtSingle');
    setDiagramLabel(diagramData?.diagramLabel ?? '');
  };

  const handleImport = async (model: File | null) => {
    setHasError(false);
    setAlertMessage('');
    if (model) {
      const content = await model.text();
      try {
        const parsedContent = JSON.parse(content) as EMRALD_Model;
        const importedModel = parsedContent.emraldVersion
          ? parsedContent
          : upgradeModel(content);
        if (
          importedModel
          && importedModel.DiagramList.length === 1
          && formWindowId
        ) {
          importedModel.id = uuidv4();
          importedModel.name = importedModel.DiagramList[0]?.name;
          setImportDiagram(importedModel);
        } else {
          setHasError(true);
          setAlertMessage(
            'The imported item is not a valid EMRALD model or contains multiple diagrams.',
          );
          setImportDiagram(undefined);
        }
      } catch {
        console.error('Invalid JSON format');
      }
    }

    setSelectedTemplate(undefined);
    reset();
  };

  const handleNameChange = (newName: string) => {
    // Trim leading and trailing whitespace
    const trimmedName = newName.trim();

    // Set the error state
    setHasError(
      diagrams
        .filter(diagram => diagram.name !== originalName)
        .some(node => node.name === trimmedName)
        || /[^a-zA-Z0-9-_ ]/.test(trimmedName),
    );

    // Set the name (trimmed version)
    setName(newName);
  };

  const handleTabChange = (_event: React.SyntheticEvent, tabValue: number) => {
    setCurrentTab(tabValue);
  };

  return (
    <Box mx={3} pb={3} height="100%">
      <Box mt={3}>
        {diagramData ? (
          <Tabs value={currentTab} onChange={handleTabChange}>
            <Tab label="Edit Diagram" />
          </Tabs>
        ) : (
          <Tabs value={currentTab} onChange={handleTabChange}>
            <Tab label="Create Diagram" />
            <Tab label="Import Diagram" />
            <Tab label="From Template" />
          </Tabs>
        )}
      </Box>

      <TabPanel value={currentTab} index={0}>
        {importDiagram || selectedTemplate ? (
          <Alert
            sx={{ mb: 3, width: '75%' }}
            severity="warning"
            variant="outlined"
          >
            Form fields are disabled when a imported diagram or template is
            selected. To change these values, please remove the imported diagram
            or template.
          </Alert>
        ) : (
          <></>
        )}
        <form>
          <MainDetailsForm
            itemType="Diagram"
            type={diagramType}
            setType={setDiagramType}
            typeOptions={diagramTypeOptions}
            typeDisabled={
              !!selectedTemplate || !!importDiagram || !!diagramData
            }
            nameDisabled={!!selectedTemplate || !!importDiagram}
            descDisabled={!!selectedTemplate || !!importDiagram}
            name={name}
            desc={desc}
            setDesc={setDesc}
            handleSave={handleSave}
            handleNameChange={handleNameChange}
            nameError={hasError}
            error={hasError}
            errorMessage="A Diagram with this name already exists, or this name contains special characters."
            reqPropsFilled={
              name && diagramLabel && !selectedTemplate && !importDiagram
                ? true
                : false
            }
          >
            <Autocomplete
              freeSolo
              disabled={!!selectedTemplate || !!importDiagram}
              options={diagramLabels}
              renderInput={params => (
                <TextField {...params} label="Diagram Group Label" />
              )}
              onChange={(_event, newValue) => {
                setDiagramLabel(newValue ?? '');
              }}
              onInputChange={(_event, newInputValue) => {
                setDiagramLabel(newInputValue);
              }}
              value={diagramLabel}
              fullWidth
              size="small"
              sx={{ mt: 1 }}
            />
          </MainDetailsForm>
        </form>
      </TabPanel>
      <TabPanel value={currentTab} index={1}>
        <Box>
          {selectedTemplate || hasError ? (
            <Alert sx={{ mb: 3 }} severity="warning" variant="outlined">
              {alertMessage
                ?? 'The selected template will be ignored when using an imported diagram.'}
            </Alert>
          ) : (
            <></>
          )}
          <Box ml={3}>
            <FileUploadComponent
              label="Choose File"
              setFile={file => void handleImport(file)}
              fileName={importDiagram ? importDiagram.name : undefined}
              accept=".json, .emrald"
              clearFile={() => {
                setImportDiagram(undefined);
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 5 }}>
            <Button
              variant="contained"
              color="primary"
              sx={{ mr: 2 }}
              disabled={hasError || !importDiagram}
              onClick={() => {
                handleSave();
              }}
            >
              Save
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                handleClose();
              }}
            >
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
              Selected Group:&nbsp;
              <b>{selectedGroup}</b>
              {selectedGroup ? (
                <IconButton
                  aria-label="close"
                  onClick={() => {
                    setSelectedGroup('');
                  }}
                  sx={{
                    color: (theme: Theme) => theme.palette.grey[500],
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
              Selected Template:&nbsp;
              <b>{selectedTemplate?.name}</b>
              {selectedTemplate ? (
                <IconButton
                  aria-label="close"
                  onClick={() => {
                    setSelectedTemplate(undefined);
                  }}
                  sx={{
                    color: (theme: Theme) => theme.palette.grey[500],
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
              <Typography variant="subtitle1" fontWeight="bold">
                Group List
              </Typography>
              <GroupListItems
                selectedGroup={selectedGroup}
                setSelectedGroup={setSelectedGroup}
              />
            </Box>
            <Box ml={3} flex={1}>
              <Typography variant="subtitle1" fontWeight="bold">
                Template List
              </Typography>
              <List
                sx={{
                  width: '100%',
                  maxWidth: 360,
                  bgcolor: 'background.paper',
                }}
                aria-label="contacts"
              >
                {groupTemplates.map(template => (
                  <ListItem disablePadding key={template.name}>
                    <ListItemButton
                      sx={{
                        backgroundColor:
                          template.name === selectedTemplate?.name
                            ? 'lightgreen'
                            : 'white',
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
              onClick={() => {
                handleSave();
              }}
            >
              Save
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                handleClose();
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </TabPanel>
    </Box>
  );
};
