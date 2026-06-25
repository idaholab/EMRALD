import type { Variable } from '@/types/EMRALD_Model';
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Tooltip,
} from '@mui/material';
import { appData } from '@/hooks/useAppData';

const extSimOnlyBuiltIns = new Set(['ExtSimStartTime', 'NextEvTime']);

export type CodeContext = 'event' | 'changeVarValue' | 'runApplication';

interface BuiltInVariable {
  name: string;
  type: string;
  description: string;
}

const commonRand: BuiltInVariable = {
  name: 'Rand',
  type: 'Random',
  description:
    'Shared random number generator (System.Random) used by the simulator.',
};

const builtInsByContext: Record<CodeContext, BuiltInVariable[]> = {
  event: [
    {
      name: 'CurTime',
      type: 'double',
      description: 'Current simulation time, in hours.',
    },
    {
      name: 'RunIdx',
      type: 'int',
      description:
        'Index of the current Monte Carlo simulation run (zero-based).',
    },
    {
      name: 'ExtSimStartTime',
      type: 'double',
      description: 'Start time of the external simulator, in hours.',
    },
    {
      name: 'NextEvTime',
      type: 'double',
      description: 'Scheduled time of the next event, in hours.',
    },
    {
      name: 'RootPath',
      type: 'string',
      description: 'Root path of the model being simulated.',
    },
    commonRand,
  ],
  changeVarValue: [
    {
      name: 'CurTime',
      type: 'double',
      description: 'Current simulation time, in hours.',
    },
    {
      name: 'RunIdx',
      type: 'int',
      description:
        'Index of the current Monte Carlo simulation run (zero-based).',
    },
    {
      name: 'ExtSimStartTime',
      type: 'double',
      description: 'Start time of the external simulator, in hours.',
    },
    {
      name: 'RootPath',
      type: 'string',
      description: 'Root path of the model being simulated.',
    },
    {
      name: 'OrigRootPath',
      type: 'string',
      description:
        'Original root path of the model as it was loaded (before any path remapping).',
    },
    commonRand,
  ],
  runApplication: [
    {
      name: 'CurTime',
      type: 'double',
      description: 'Current simulation time, in hours.',
    },
    {
      name: 'RunIdx',
      type: 'int',
      description:
        'Index of the current Monte Carlo simulation run (zero-based).',
    },
    {
      name: 'ExePath',
      type: 'string',
      description: 'Full path to the external executable being run.',
    },
    {
      name: 'RootPath',
      type: 'string',
      description: 'Root path of the model being simulated.',
    },
    {
      name: 'OrigRootPath',
      type: 'string',
      description:
        'Original root path of the model as it was loaded. Available in the preprocess code only.',
    },
    {
      name: 'MultiThreaded',
      type: 'bool',
      description:
        'True when the simulation is running in multi-threaded mode.',
    },
    {
      name: 'ExeExitCode',
      type: 'int',
      description:
        'Exit code returned by the executable. Available in the postprocess code only.',
    },
    commonRand,
  ],
};

function formatTooltip(
  name: string,
  type: string,
  description: string,
): string {
  return `${name} (${type})\n${description}`;
}

interface CodeVariablesProps {
  variableList: Variable[];
  codeVariables: string[];
  addToUsedVariables: (variableName: string) => void;
  height?: string;
  codeContext?: CodeContext;
}
export const CodeVariables: React.FC<CodeVariablesProps> = ({
  variableList,
  codeVariables,
  addToUsedVariables,
  height,
  codeContext = 'event',
}) => {
  const hasExternalSim = appData.value.ExtSimList.length > 0;
  const builtIns = builtInsByContext[codeContext].filter(
    builtIn => hasExternalSim || !extSimOnlyBuiltIns.has(builtIn.name),
  );
  return (
    <Box>
      <b>Variables used in code</b>
      <Box sx={{ height: height ?? '340px', overflowY: 'auto', ml: 3 }}>
        <FormGroup>
          {builtIns.map(builtIn => (
            <Tooltip
              key={builtIn.name}
              title={
                <span style={{ whiteSpace: 'pre-line' }}>
                  {formatTooltip(
                    builtIn.name,
                    builtIn.type,
                    builtIn.description,
                  )}
                </span>
              }
              placement="left"
              arrow
            >
              <FormControlLabel
                control={
                  <Checkbox sx={{ p: '0 9px' }} checked={true} disabled />
                }
                label={builtIn.name}
              />
            </Tooltip>
          ))}
          {variableList.map(variable => (
            <Tooltip
              key={variable.id}
              title={
                <span style={{ whiteSpace: 'pre-line' }}>
                  {formatTooltip(
                    variable.name,
                    variable.type,
                    variable.desc && variable.desc.length > 0
                      ? variable.desc
                      : 'No description provided.',
                  )}
                </span>
              }
              placement="left"
              arrow
            >
              <FormControlLabel
                control={
                  <Checkbox
                    sx={{ p: '0 9px' }}
                    checked={codeVariables.includes(variable.name)}
                    onChange={() => {
                      addToUsedVariables(variable.name);
                    }}
                    name={variable.name}
                  />
                }
                label={variable.name}
              />
            </Tooltip>
          ))}
        </FormGroup>
      </Box>
    </Box>
  );
};
