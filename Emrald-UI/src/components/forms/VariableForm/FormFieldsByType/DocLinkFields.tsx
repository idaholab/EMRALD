import { MenuItem, TextField, Typography, Link, FormControlLabel, Checkbox } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import React, { Dispatch, SetStateAction } from 'react';
import { DocVarType, VariableType } from '../../../../types/ItemTypes';

interface DocLinkFieldsProps {
  docType: string;
  setDocType: Dispatch<SetStateAction<string | undefined>>;
  docPath: string;
  setDocPath: (docPath: string) => void;
  docLink: string;
  setDocLink: (docLink: string) => void;
  pathMustExist: boolean | undefined;
  setPathMustExist: (value: boolean) => void;
  value: number | string | boolean;
  setValue: Function;
  type: VariableType;
  regExpLine: number;
  setRegExpLine: Dispatch<SetStateAction<number | undefined>>;
  begPosition: number;
  setBegPosition: Dispatch<SetStateAction<number | undefined>>;
  setShowRegExFields: Dispatch<SetStateAction<boolean | undefined>>;
  showRegExFields: boolean | undefined;
  numChars: number;
  setNumChars: Dispatch<SetStateAction<number | undefined>>;
  showNumChars: boolean | undefined;
  setShowNumChars: Dispatch<SetStateAction<boolean | undefined>>;
}

const DocLinkFields: React.FC<DocLinkFieldsProps> = ({
  docType,
  setDocType,
  docPath,
  setDocPath,
  docLink,
  setDocLink,
  pathMustExist,
  setPathMustExist,
  value,
  setValue,
  type,
  regExpLine,
  setRegExpLine,
  begPosition,
  setBegPosition,
  showRegExFields,
  setShowRegExFields,
  numChars,
  setNumChars,
  showNumChars,
  setShowNumChars,
}) => {
  return (
    <>
      <FormControl variant="outlined" size="small" sx={{ minWidth: 120, width: '100%', my: 1 }}>
        <InputLabel id="demo-simple-select-standard-label">Doc Type</InputLabel>
        <Select
          labelId="doc-type"
          id="dec-=type"
          value={docType}
          onChange={(event: SelectChangeEvent<string>) =>
            setDocType(event.target.value as DocVarType)
          }
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
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDocPath(e.target.value)}
        fullWidth
        sx={{ mb: 0 }}
      />
      <Typography variant={'caption'}>
        {`Use ${
          docType === 'dtXML' ? 'XPath' : docType === 'dtJSON' ? 'JSONPath' : 'Regular Expression'
        } Syntax for the Var Link. `}
        <Link
          target="_blank"
          href={
            docType === 'dtXML' || docType === 'dtTextRegEx'
              ? 'https://www.site24x7.com/tools/xpath-evaluator.html'
              : 'https://jsonpath.com/'
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
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDocLink(e.target.value)}
        fullWidth
        sx={{ mb: 0 }}
      />
      <FormControlLabel
        label="Doc Path and Var Link must exist on startup"
        control={
          <Checkbox
            checked={pathMustExist ? true : false}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPathMustExist(e.target.checked)
            }
          />
        }
      />
      {docType === 'dtTextRegEx' && (
        <>
          <FormControlLabel
            label="Line #"
            control={
              <Checkbox
                checked={showRegExFields}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
          {showRegExFields && (
            <>
              <FormControlLabel
                label="Num Chars"
                control={
                  <Checkbox
                    checked={showNumChars}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setRegExpLine(parseInt(e.target.value))
                }
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setBegPosition(parseInt(e.target.value))
                }
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNumChars(parseInt(e.target.value))
                  }
                  fullWidth
                  sx={{ mb: 0 }}
                />
              )}
            </>
          )}
        </>
      )}
      {type === 'int' || type === 'double' ? (
        <TextField
          label="Default"
          margin="normal"
          variant="outlined"
          type="number"
          size="small"
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e)}
          fullWidth
          sx={{ mb: 0 }}
        />
      ) : type === 'bool' ? (
        <FormControl variant="outlined" size="small" sx={{ minWidth: 120, width: '100%', my: 1 }}>
          <InputLabel id="demo-simple-select-standard-label">Default</InputLabel>
          <Select
            labelId="value"
            id="value"
            value={value as string}
            onChange={(event: SelectChangeEvent<string>) => setValue(event)}
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
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e)}
          sx={{ mb: 0 }}
          fullWidth
        />
      )}
    </>
  );
};

export default DocLinkFields;
