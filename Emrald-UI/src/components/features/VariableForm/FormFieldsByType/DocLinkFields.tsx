import {
  MenuItem,
  TextField,
  Typography,
  Link,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import React from 'react';

interface DocLinkFieldsProps {
  docType: string;
  setDocType: (docType: string) => void;
  docPath: string;
  setDocPath: (docPath: string) => void;
  docLink: string;
  setDocLink: (docLink: string) => void;
  pathMustExist: boolean;
  setPathMustExist: (value: boolean) => void;
  value: number;
  setValue: (value: number) => void;
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
}) => {
  return (
    <>
      <FormControl
        variant="outlined"
        size="small"
        sx={{ minWidth: 120, width: '100%', my: 1 }}
      >
        <InputLabel id="demo-simple-select-standard-label">Doc Type</InputLabel>
        <Select
          labelId="doc-type"
          id="dec-=type"
          value={docType}
          onChange={(event: SelectChangeEvent<string>) =>
            setDocType(event.target.value)
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
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setDocPath(e.target.value)
        }
        fullWidth
        sx={{ mb: 0 }}
      />
      <Typography variant={'caption'}>
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
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setDocLink(e.target.value)
        }
        fullWidth
        sx={{ mb: 0 }}
      />
      <FormControlLabel
        label="Doc Path and Var Link must exist on startup"
        control={
          <Checkbox
            checked={pathMustExist}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPathMustExist(e.target.checked)
            }
          />
        }
      />
      <TextField
        label="Default"
        margin="normal"
        variant="outlined"
        type="number"
        size="small"
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setValue(Number(e.target.value))
        }
        fullWidth
        sx={{ mb: 0 }}
      />
    </>
  );
};

export default DocLinkFields;
