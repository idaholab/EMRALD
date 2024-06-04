import React from 'react';
import { EMRALD_Model } from '../../../types/EMRALD_Model';
// Material UI Components
import {
  Box,
  Button,
  Checkbox,
  Collapse,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { DialogComponent, TextFieldComponent } from '../../common';
// Icons
import { FaLock } from 'react-icons/fa6';
import { FaLockOpen } from 'react-icons/fa6';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
// Hook
import { useTemplateForm } from './useTemplateForm';
// Types
import { Group } from '../../../types/ItemTypes';

interface TemplateDiagramFormProps {
  templatedData: EMRALD_Model;
}

const TemplateForm: React.FC<TemplateDiagramFormProps> = ({ templatedData }) => {
  const {
    findValue,
    replaceValue,
    templatedItems,
    templateName,
    templateDesc,
    anchorEl,
    showGroupDialog,
    groupType,
    newGroupName,
    selectedGroup,
    currentGroup,
    groupList,
    expanded,
    duplicateNameError,
    setFindValue,
    setReplaceValue,
    setTemplateName,
    setTemplateDesc,
    setNewGroupName,
    setShowGroupDialog,
    setCurrentGroup,
    setSelectedGroup,
    handleShowGroupDialog,
    handleMenuClose,
    handleContextMenu,
    handleNewNameChange,
    handleLockChange,
    lockAll,
    unlockAll,
    updateAllUnlocked,
    handleActionChange,
    handleExcludeChange,
    handleRequiredChange,
    handleClose,
    handleApply,
    handleSave,
    addNewGroup,
    deleteGroup,
    toggleExpand,
    handleNewGroupNameChange
  } = useTemplateForm(templatedData);

  const renderListItems = (data: Group[], level: number = 1) => {
    return data.map((item) => (
      <React.Fragment key={item.name}>
        <ListItemButton
          onClick={() => {
            toggleExpand(item.name);
            setSelectedGroup(item.name);
          }}
          onContextMenu={(e) => handleContextMenu(e, item)}
          sx={{ backgroundColor: item.name === selectedGroup ? 'lightgreen' : 'white' }}
        >
          <ListItemIcon>
            {expanded.includes(item.name) && item.subgroup && item.subgroup.length > 0 ? (
              <FolderOpenIcon />
            ) : (
              <FolderIcon />
            )}
          </ListItemIcon>
          <ListItemText primary={item.name} />
          {item.subgroup && item.subgroup.length > 0 && (
            <>{expanded.includes(item.name) ? <ExpandLess /> : <ExpandMore />}</>
          )}
        </ListItemButton>

        {item.subgroup && item.subgroup.length > 0 && (
          <Collapse in={expanded.includes(item.name)} timeout="auto" unmountOnExit>
            <List
              component="div"
              disablePadding
              sx={{
                pl: 3,
              }}
            >
              {renderListItems(item.subgroup, level + 1)}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    ));
  };

  return (
    <Box mx={3}>
      <Box mt={2}>
        <Typography variant="h5" fontWeight={'bold'}>
          Create a Template
        </Typography>

        <TextFieldComponent label="Name" value={templateName} setValue={setTemplateName} />
        <TextFieldComponent label="Description" value={templateDesc} setValue={setTemplateDesc} />
        <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'} mt={3}>
          <Typography variant="subtitle1">
            {groupList.length > 0 ? (
              <span>
                Assign this template to group:{' '}
                <span style={{ fontWeight: 'bold' }}>{selectedGroup}</span>
              </span>
            ) : (
              'Create a new group to assign this template'
            )}
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              handleShowGroupDialog('main');
            }}
          >
            Add Main Group
          </Button>
        </Box>
        <Box>
          <List
            sx={{ width: '100%', maxWidth: 500, bgcolor: 'background.paper' }}
            component="nav"
            aria-labelledby="nested-list-subheader"
          >
            {renderListItems(groupList)}
          </List>
        </Box>
      </Box>
      <Divider sx={{ mt: 3 }} />
      <Box display={'flex'} alignItems={'center'}>
        <TextFieldComponent label="Find" value={findValue} setValue={setFindValue} sx={{ mr: 4 }} />
        <TextFieldComponent
          label="Replace With"
          value={replaceValue}
          setValue={setReplaceValue}
          sx={{ mr: 4 }}
        />
        <Box mt={2}>
          <Button variant="contained" onClick={handleApply}>
            Apply
          </Button>
        </Box>
      </Box>

      <Box display={'flex'} alignItems={'center'}>
        <Box mt={2} mr={3}>
          <Button startIcon={<FaLock />} variant="contained" onClick={lockAll}>
            Lock All
          </Button>
        </Box>
        <Box mt={2}>
          <Button
            startIcon={<FaLockOpen />}
            variant="contained"
            color="secondary"
            onClick={unlockAll}
          >
            Unlock All
          </Button>
        </Box>
      </Box>

      <Box display={'flex'} alignItems={'center'}>
        <Box mt={2} mr={2}>
          <Button color="secondary" variant="contained" onClick={() => updateAllUnlocked('keep')}>
            Keep All
          </Button>
        </Box>
        <Box mt={2}>
          <Button variant="contained" color="secondary" onClick={() => updateAllUnlocked('rename')}>
            Rename All
          </Button>
        </Box>
      </Box>

      <Box mt={3} maxHeight={'400px'} overflow={'auto'}>
        <Table sx={{ minWidth: 650 }} size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Type</b>
              </TableCell>
              <TableCell align="center">
                <b>Lock</b>
              </TableCell>
              <TableCell align="left">
                <b>Old Name</b>
              </TableCell>
              <TableCell align="center" sx={{ width: '25%' }}>
                <b>Action</b>
              </TableCell>
              <TableCell align="left" sx={{ width: '20%' }}>
                <b>New Name</b>
              </TableCell>
              <TableCell align="center">
                <b>Exclude</b>
              </TableCell>
              <TableCell align="center">
                <b>Required</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {templatedItems.map((row, index) => (
              <TableRow
                key={index}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  position: 'relative',
                  ...(row.requiredInImportingModel && (row.type === 'State' || row.type === 'Diagram') && {
                    backgroundColor: '#f5f5f5',
                  }),
                  ...(row.exclude && {
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: '50%',
                      backgroundColor: '#000',
                      left: 0,
                      right: 0,
                      height: '1px',
                      width: '80%',
                      textDecoration: 'line-through',
                    },
                  }),
                }}
              >
                <TableCell component="th" scope="row">
                  <Typography>{row.type}</Typography>
                </TableCell>
                <TableCell align="center">
                  {row.locked ? (
                    <IconButton
                      sx={{ color: '#1b8f55' }}
                      disabled={row.exclude}
                      onClick={() => handleLockChange(index, false)}
                    >
                      <FaLock />
                    </IconButton>
                  ) : (
                    <IconButton
                      sx={{ color: '#d32c38' }}
                      disabled={row.exclude}
                      onClick={() => handleLockChange(index, true)}
                    >
                      <FaLockOpen />
                    </IconButton>
                  )}
                </TableCell>
                <TableCell align="left">
                  <Typography>{row.oldName}</Typography>
                </TableCell>
                <TableCell align="center">
                  <FormControl>
                    <RadioGroup
                      row
                      aria-labelledby="demo-row-radio-buttons-group-label"
                      name="row-radio-buttons-group"
                      value={row.action}
                      onChange={(e) => handleActionChange(index, e.target.value)}
                    >
                      <FormControlLabel
                        value="keep"
                        control={
                          <Radio
                            disabled={
                              row.locked ||
                              row.exclude ||
                              (row.type === 'State' && templatedData.DiagramList.length > 0)
                            }
                          />
                        }
                        label="Keep Name"
                      />
                      <FormControlLabel
                        value="rename"
                        control={<Radio disabled={row.locked || row.exclude} />}
                        label="Rename"
                      />
                    </RadioGroup>
                  </FormControl>
                </TableCell>
                <TableCell align="left">
                  <TextField
                    value={row.action === 'rename' ? row.newName : ''}
                    disabled={row.locked || row.action !== 'rename' || row.exclude}
                    onChange={(e) => handleNewNameChange(index, e.target.value)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  {row.type !== 'Diagram' ? (
                    <Checkbox
                      checked={row.exclude}
                      disabled={row.requiredInImportingModel}
                      onChange={(e) => handleExcludeChange(index, e.target.checked)}
                    />
                  ) : (
                    <></>
                  )}
                </TableCell>
                <TableCell align="center">
                  <Box
                    sx={{
                      position: 'relative',
                      ...(row.exclude && {
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          top: '50%',
                          backgroundColor: '#000',
                          left: 0,
                          right: 0,
                          height: '1px',
                          width: '80%',
                          textDecoration: 'line-through',
                        },
                      }),
                    }}
                  >
                    <Checkbox
                      disabled={row.exclude || row.type === 'State' || row.type === 'Diagram'}
                      checked={row.requiredInImportingModel}
                      onChange={(e) => handleRequiredChange(index, e.target.checked)}
                    />
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <Box mt={3} textAlign={'right'}>
        <Button variant="contained" sx={{ mr: 2 }} disabled={!templateName || !templateDesc} onClick={handleSave}>
          Save Changes
        </Button>
        <Button variant="contained" color="secondary" onClick={() => handleClose()}>
          Cancel
        </Button>
      </Box>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => handleShowGroupDialog('sub')}>Add Sub Group</MenuItem>
        <Divider />
        <MenuItem onClick={() => handleShowGroupDialog('delete')}>Delete Group</MenuItem>
      </Menu>
      {showGroupDialog && (
        <DialogComponent
          open={true}
          title={
            groupType === 'sub'
              ? 'Add Sub Group'
              : groupType === 'main'
              ? 'Add Main Group'
              : 'Delete Group'
          }
          submitText={groupType === 'delete' ? 'Delete' : 'Save'}
          disabled={duplicateNameError}
          onSubmit={() => {
            groupType === 'sub' || groupType === 'main' ? addNewGroup() : deleteGroup();
          }}
          onClose={() => {
            setShowGroupDialog(false);
            setCurrentGroup(undefined);
            setNewGroupName('');
          }}
        >
          {groupType === 'main' || groupType === 'sub' ? (
            <TextField
              label="New Group Name"
              size='small'
              value={newGroupName}
              onChange={(e) => handleNewGroupNameChange(e.target.value)}
              sx={{ width: 500, mt: 2 }}
              error={duplicateNameError}
              helperText={duplicateNameError ? 'A group with this name already exists' : ''}
            />
          ) : (
            <Typography>
              Are you sure you want to delete the group <b>{currentGroup?.name}</b>? All items under
              this group will be deleted also.
            </Typography>
          )}
        </DialogComponent>
      )}
    </Box>
  );
};

export default TemplateForm;
