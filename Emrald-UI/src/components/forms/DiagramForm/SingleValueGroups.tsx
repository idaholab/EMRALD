import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Paper from '@mui/material/Paper';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

interface SingleValueGroupsProps {
  states: string[];
}

export const SingleValueGroups: React.FC<SingleValueGroupsProps> = ({
  states,
}) => (
  <TableContainer component={Paper}>
    <Table size="small" aria-label="a dense table">
      <TableHead>
        <TableRow>
          <TableCell sx={{ fontWeight: 'bold', p: 2 }}>State Name</TableCell>
          <TableCell sx={{ fontWeight: 'bold' }}>Success State</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {states.map((state, index) => (
          <TableRow key={index}>
            <TableCell component="th" scope="row">
              {state}
            </TableCell>
            <TableCell>
              <FormControl>
                <RadioGroup
                  row
                  aria-labelledby="eval-values"
                  name="eval-buttons-group"
                  value={state}
                  // onChange={(e) => handleChange(e, state)}
                >
                  <FormControlLabel
                    value="False"
                    control={<Radio />}
                    label="False"
                  />
                  <FormControlLabel
                    value="True"
                    control={<Radio />}
                    label="True"
                  />
                </RadioGroup>
              </FormControl>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);
