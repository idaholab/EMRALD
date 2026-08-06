import type { VariableFormProps } from '../VariableForm';
import type { DocVarType } from '@/types/EMRALD_Model';
import {
  Checkbox,
  FormControlLabel,
  Link,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import { useEffect, useState } from 'react';
import { useVariableFormContext } from '../VariableFormContext';

export const DocLinkFields: React.FC<VariableFormProps> = ({
  variableData,
}) => {
  const {
    value,
    setValue,
    type,
    setAccrualStatesData,
    setTypeProperties,
    sync,
  } = useVariableFormContext();

  const [docType, setDocType] = useState<DocVarType>('dtXML');
  const [docPath, setDocPath] = useState<string>();
  const [docLink, setDocLink] = useState<string>();
  const [pathMustExist, setPathMustExist] = useState(true);
  const [regExpLine, setRegExpLine] = useState<number>();
  const [begPosition, setBegPosition] = useState<number>();
  const [showRegExFields, setShowRegExFields] = useState<boolean>();
  const [showNumChars, setShowNumChars] = useState<boolean>();
  const [numChars, setNumChars] = useState<number>();
  const [showGroup, setShowGroup] = useState(false);
  const [regExpGroup, setRegExpGroup] = useState<number>();

  useEffect(() => {
    setDocType(variableData?.docType ?? 'dtXML');
    setDocPath(variableData?.docPath);
    setDocLink(variableData?.docLink);
    setPathMustExist(variableData?.pathMustExist ?? true);
    if (variableData?.regExpLine !== undefined) {
      setShowRegExFields(true);
      setRegExpLine(variableData.regExpLine);
    }
    if (variableData?.begPosition !== undefined) {
      setShowRegExFields(true);
      setBegPosition(variableData.begPosition);
    }
    if (variableData?.numChars !== undefined) {
      setShowNumChars(true);
      setNumChars(variableData.numChars);
    }
    if (variableData?.regExpGroup !== undefined) {
      setShowGroup(true);
      setRegExpGroup(variableData.regExpGroup);
    }
    setAccrualStatesData(variableData?.accrualStatesData);
    setTypeProperties([
      'docType',
      'docPath',
      'docLink',
      'pathMustExist',
      'numChars',
      'regExpLine',
      'begPosition',
      'accrualStatesData',
      'regExpGroup',
    ]);
  }, []);

  useEffect(() => {
    sync({
      docLink,
      docPath,
      docType,
      pathMustExist,
      numChars,
      regExpLine,
      begPosition,
      regExpGroup,
    });
  }, [
    docLink,
    docPath,
    docLink,
    pathMustExist,
    numChars,
    regExpLine,
    begPosition,
    regExpGroup,
  ]);

  return (
    <>
      <FormControl
        variant="outlined"
        size="small"
        sx={{ minWidth: 120, width: '100%', my: 1 }}
      >
        <InputLabel id="doc-type-label">Doc Type</InputLabel>
        <Select
          aria-labelledby="doc-type-label"
          value={docType}
          onChange={event => {
            setDocType(event.target.value as DocVarType);
          }}
          label="Doc Type"
        >
          <MenuItem value="dtXML">XML</MenuItem>
          <MenuItem value="dtJSON">JSON</MenuItem>
          <MenuItem value="dtTextRegEx">Text RegEx</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Doc Path"
        margin="normal"
        variant="outlined"
        size="small"
        value={docPath}
        onChange={e => {
          setDocPath(e.target.value);
        }}
        fullWidth
        sx={{ mb: 0 }}
      />
      <Typography variant="caption">
        {`Use ${
          docType === 'dtXML'
            ? 'XPath'
            : docType === 'dtJSON'
              ? 'JSONPath'
              : 'Regular Expression'
        } Syntax for the Var Link. `}
        <Link
          target="_blank"
          href={
            docType === 'dtXML'
              ? 'https://www.site24x7.com/tools/xpath-evaluator.html'
              : docType === 'dtJSON'
                ? 'https://jsonpath.com/'
                : 'https://regex101.com/'
          }
        >
          Tester
        </Link>
      </Typography>
      <TextField
        label="Var Link"
        margin="normal"
        variant="outlined"
        size="small"
        value={docLink}
        onChange={e => {
          setDocLink(e.target.value);
        }}
        fullWidth
        sx={{ mb: 0 }}
      />
      <FormControlLabel
        label="Doc Path and Var Link must exist on startup"
        control={
          <Checkbox
            checked={pathMustExist ? true : false}
            onChange={e => {
              setPathMustExist(e.target.checked);
            }}
          />
        }
      />
      {docType === 'dtTextRegEx' && (
        <>
          <br />
          <FormControlLabel
            label="Line #"
            control={
              <Checkbox
                checked={showRegExFields}
                onChange={e => {
                  if (!e.target.checked) {
                    setRegExpLine(undefined);
                    setBegPosition(undefined);
                    setNumChars(undefined);
                    setShowNumChars(undefined);
                  }
                  setShowRegExFields(e.target.checked);
                }}
              />
            }
          />
          <Tooltip title="Read the value from a match group in your Regex expression">
            <FormControlLabel
              label="Read from group"
              control={
                <Checkbox
                  checked={showGroup}
                  onChange={e => {
                    if (!e.target.checked) {
                      setRegExpGroup(undefined);
                    }
                    setShowGroup(e.target.checked);
                  }}
                />
              }
            />
          </Tooltip>
          {showRegExFields && (
            <>
              <FormControlLabel
                label="Num Chars"
                control={
                  <Checkbox
                    checked={showNumChars}
                    onChange={e => {
                      !e.target.checked && setNumChars(undefined);
                      setShowNumChars(e.target.checked);
                    }}
                  />
                }
              />
              <TextField
                label="Line #"
                margin="normal"
                variant="outlined"
                type="number"
                size="small"
                value={regExpLine}
                onChange={e => {
                  setRegExpLine(Number.parseInt(e.target.value));
                }}
                fullWidth
                sx={{ mb: 0 }}
              />
              <TextField
                label="Beg Position"
                margin="normal"
                variant="outlined"
                type="number"
                size="small"
                value={begPosition}
                onChange={e => {
                  setBegPosition(Number.parseInt(e.target.value));
                }}
                fullWidth
                sx={{ mb: 0 }}
              />
              {showNumChars && (
                <TextField
                  label="Num Chars"
                  margin="normal"
                  variant="outlined"
                  type="number"
                  size="small"
                  value={numChars}
                  onChange={e => {
                    setNumChars(Number.parseInt(e.target.value));
                  }}
                  fullWidth
                  sx={{ mb: 0 }}
                />
              )}
            </>
          )}
          {showGroup && (
            <TextField
              label="Match Group"
              margin="normal"
              variant="outlined"
              type="number"
              size="small"
              value={regExpGroup}
              onChange={e => {
                setRegExpGroup(Number.parseInt(e.target.value));
              }}
              fullWidth
              sx={{ mb: 0 }}
            />
          )}
        </>
      )}
      {type === 'int' || type === 'double' ? (
        <TextField
          label="Default Value"
          margin="normal"
          variant="outlined"
          type="number"
          size="small"
          value={value}
          onChange={e => {
            setValue(e.target.value);
          }}
          fullWidth
          sx={{ mb: 0 }}
        />
      ) : type === 'bool' ? (
        <FormControl
          variant="outlined"
          size="small"
          sx={{ minWidth: 120, width: '100%', my: 1 }}
        >
          <InputLabel>Default</InputLabel>
          <Select
            labelId="value"
            id="value"
            value={value as string}
            onChange={e => {
              setValue(e.target.value);
            }}
            label="Default"
            fullWidth
          >
            <MenuItem value="true">True</MenuItem>
            <MenuItem value="false">False</MenuItem>
          </Select>
        </FormControl>
      ) : (
        <TextField
          label="Default"
          margin="normal"
          variant="outlined"
          type="text"
          size="small"
          value={value}
          onChange={e => {
            setValue(e.target.value);
          }}
          sx={{ mb: 0 }}
          fullWidth
        />
      )}
    </>
  );
};
