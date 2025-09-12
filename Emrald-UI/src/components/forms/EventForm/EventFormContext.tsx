import type { JSX, PropsWithChildren } from 'react';
import { createContext, useContext, useState } from 'react';
import type {
  Event,
  EventDistributionParameter,
  State,
  DistributionType,
  EventDistributionParameterName,
  EventType,
  ExtEventMsgType,
  TimeVariableUnit,
  VarChangeOptions,
  WindowPosition,
} from '../../../types/EMRALD_Model';
import { useWindowContext } from '../../../contexts/WindowContext';
import { emptyEvent, useEventContext } from '../../../contexts/EventContext';
import { useSignal } from '@preact/signals-react';
import {
  ComponentLogic,
  Distribution,
  ExtSim,
  FailureRate,
  StateChange,
  Timer,
  VarCondition,
} from './FormFieldsByType';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { appData } from '../../../hooks/useAppData';
import { convertToISOString } from '../../../utils/util-functions';

interface EventFormContextType {
  allItems?: boolean;
  allRows: RowType;
  hasError: boolean;
  name: string;
  codeVariables: string[] | undefined;
  desc: string;
  dfltTimeRate: TimeVariableUnit | undefined;
  distType: DistributionType | undefined;
  eventStateIndex: number;
  eventTypeOptions: { value: string; label: string }[];
  eventTypeToComponent: Record<string, { component: () => JSX.Element; props: any }>;
  evType: EventType;
  extEventType: ExtEventMsgType | undefined;
  failureRateMilliseconds: number | undefined;
  fromSimStart: boolean | undefined;
  ifInState: boolean | undefined;
  lambda: string | number | undefined;
  lambdaTimeRate: string | undefined;
  logicTop: string | undefined;
  timerMilliseconds: number | undefined;
  moveFromCurrent: boolean;
  onSuccess: boolean | undefined;
  onVarChange: VarChangeOptions | undefined;
  parameters: EventDistributionParameter[] | undefined;
  persistent: boolean | undefined;
  scriptCode: string | undefined;
  time: string | undefined;
  timeVariableUnit: TimeVariableUnit | undefined;
  triggerOnFalse: boolean | undefined;
  triggerStates?: string[];
  useDistVariable: boolean[];
  useVariable: boolean | undefined;
  invalidValues: Set<string>;
  variable: string | undefined;
  variableChecked: boolean;
  variableName: string;
  window?: WindowPosition;
  addToUsedVariables: (variableName: string) => void;
  handleChange: (row: string, value: string) => void;
  handleBlur: (row: string, value: string) => void;
  handleClose: () => void;
  handleTimerDurationChange: (value: number) => void;
  handleFailureRateDurationChange: (value: number) => void;
  handleNameChange: (value: string) => void;
  handleRateChange: (row: string, value: TimeVariableUnit | undefined) => void;
  handleSave: (eventData?: Event, state?: State) => void;
  savePosition: (position: WindowPosition) => void;
  handleSetParameters: (
    row: string,
    value: 'default' | number | boolean | TimeVariableUnit | undefined,
    varName: string,
  ) => void;
  handleChangeEventType: (string: EventType) => void;
  handleUseVariableChange: (checked: boolean, row: string) => void;
  handleVariableChange: (row: string) => void;
  InitializeForm: (eventData?: Event, state?: State) => void;
  reset: () => void;
  setAllItems: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  setAllRows: React.Dispatch<React.SetStateAction<RowType>>;
  setCodeVariables: React.Dispatch<React.SetStateAction<string[] | undefined>>;
  setDesc: React.Dispatch<React.SetStateAction<string>>;
  setDfltTimeRate: React.Dispatch<React.SetStateAction<TimeVariableUnit | undefined>>;
  setDistType: React.Dispatch<React.SetStateAction<DistributionType | undefined>>;
  setEvType: React.Dispatch<React.SetStateAction<EventType>>;
  setExtEventType: React.Dispatch<React.SetStateAction<ExtEventMsgType | undefined>>;
  setFailureRateMilliseconds: React.Dispatch<React.SetStateAction<number | undefined>>;
  setFromSimStart: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  setIfInState: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  setLambda: React.Dispatch<React.SetStateAction<string | number | undefined>>;
  setLambdaTimeRate: React.Dispatch<React.SetStateAction<string | undefined>>;
  setLogicTop: React.Dispatch<React.SetStateAction<string | undefined>>;
  setName: React.Dispatch<React.SetStateAction<string>>;
  setMoveFromCurrent: React.Dispatch<React.SetStateAction<boolean>>;
  setOnSuccess: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  setOnVarChange: React.Dispatch<React.SetStateAction<VarChangeOptions | undefined>>;
  setParameters: React.Dispatch<React.SetStateAction<EventDistributionParameter[] | undefined>>;
  setPersistent: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  setScriptCode: React.Dispatch<React.SetStateAction<string | undefined>>;
  setTime: React.Dispatch<React.SetStateAction<string | undefined>>;
  setTimerMilliseconds: React.Dispatch<React.SetStateAction<number>>;
  setTimeVariableUnit: React.Dispatch<React.SetStateAction<TimeVariableUnit | undefined>>;
  setTriggerOnFalse: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  setTriggerStates: React.Dispatch<React.SetStateAction<string[] | undefined>>;
  setUseDistVariable: React.Dispatch<React.SetStateAction<boolean[]>>;
  setUseVariable: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  setParameterVariable: (value: string, row: string) => void;
  setVariable: React.Dispatch<React.SetStateAction<string | undefined>>;
  setVariableName: React.Dispatch<React.SetStateAction<string>>;
  setInvalidValues: React.Dispatch<React.SetStateAction<Set<string>>>;
}

const EventFormContext = createContext<EventFormContextType | undefined>(undefined);

export const useEventFormContext = (): EventFormContextType => {
  const context = useContext(EventFormContext);
  if (!context) {
    throw new Error('useEventFormContext must be used within an EventFormContextProvider');
  }
  return context;
};

type RowType = Record<string, EventDistributionParameter | undefined>;

const EventFormContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [codeVariables, setCodeVariables] = useState<string[] | undefined>();
  const [scriptCode, setScriptCode] = useState<string>();
  const [variableName, setVariableName] = useState<string>('');
  const { handleClose } = useWindowContext();
  const [name, setName] = useState<string>('');
  const [desc, setDesc] = useState<string>('');
  const [evType, setEvType] = useState<EventType>('etStateCng');
  const [ifInState, setIfInState] = useState<boolean | undefined>(false);
  const [triggerStates, setTriggerStates] = useState<string[] | undefined>();
  const [moveFromCurrent, setMoveFromCurrent] = useState<boolean>(false);
  const [eventStateIndex, setEventStateIndex] = useState<number>(0);
  const [allItems, setAllItems] = useState<boolean | undefined>();
  const [onSuccess, setOnSuccess] = useState<boolean>();
  const [triggerOnFalse, setTriggerOnFalse] = useState<boolean>();
  const [logicTop, setLogicTop] = useState<string>();
  const [time, setTime] = useState<string>();
  const [timerMilliseconds, setTimerMilliseconds] = useState<number>(0);
  const [useVariable, setUseVariable] = useState<boolean>();
  const [lambda, setLambda] = useState<string | number>();
  const [onVarChange, setOnVarChange] = useState<VarChangeOptions | undefined>();
  const [distType, setDistType] = useState<DistributionType>();
  const [parameters, setParameters] = useState<EventDistributionParameter[]>();
  const [persistent, setPersistent] = useState<boolean | undefined>();
  const [useDistVariable, setUseDistVariable] = useState<boolean[]>([]);
  const [dfltTimeRate, setDfltTimeRate] = useState<TimeVariableUnit>();
  const [allRows, setAllRows] = useState<RowType>({});
  const [timeVariableUnit, setTimeVariableUnit] = useState<TimeVariableUnit>();
  const [fromSimStart, setFromSimStart] = useState<boolean>();
  const [failureRateMilliseconds, setFailureRateMilliseconds] = useState<number>();
  const [lambdaTimeRate, setLambdaTimeRate] = useState<string>();
  const [extEventType, setExtEventType] = useState<ExtEventMsgType | undefined>(undefined);
  const [variable, setVariable] = useState<string>();
  const [hasError, setHasError] = useState<boolean>(false);
  const [originalName, setOriginalName] = useState<string>();
  const [invalidValues, setInvalidValues] = useState<Set<string>>(() => new Set());
  const [windowPosition, setWindowPosition] = useState<WindowPosition | undefined>();

  const event = useSignal<Event>(emptyEvent);

  const { updateEvent, createEvent } = useEventContext();

  const eventTypeOptions = [
    { value: 'etVarCond', label: 'Var Condition' },
    { value: 'etStateCng', label: 'State Change' },
    { value: 'etComponentLogic', label: 'Component Logic' },
    { value: 'etTimer', label: 'Timer' },
    { value: 'etFailRate', label: 'Failure Rate' },
    { value: 'et3dSimEv', label: 'Ext Simulation' },
    { value: 'etDistribution', label: 'Distribution' },
  ];

  const variableChecked = Object.values(allRows)
    .map((row) => row?.useVariable)
    .some((val) => val);

  const InitializeForm = (eventData?: Event, state?: State) => {
    if (eventData) {
      event.value = eventData;
      setName(eventData.name);
      setOriginalName(eventData.name);
      setDesc(eventData.desc);
      setEvType(eventData.evType);
      eventData.code && setScriptCode(eventData.code);
      eventData.varNames && setCodeVariables(eventData.varNames);
      eventData.ifInState && setIfInState(eventData.ifInState);
      eventData.triggerStates && setTriggerStates(eventData.triggerStates);
      if (state) {
        const eventIndex = state.events.findIndex((event) => event === eventData.name);
        setEventStateIndex(eventIndex);
        setMoveFromCurrent(state.eventActions[eventIndex].moveFromCurrent);
      }
      if (eventData.allItems) {
        setAllItems(eventData.allItems);
      }
      setOnSuccess(eventData.onSuccess);
      setTriggerOnFalse(eventData.triggerOnFalse);
      eventData.logicTop && setLogicTop(eventData.logicTop);
      if (eventData.time) {
        setTime(eventData.time);
        setTimerMilliseconds(dayjs.duration(eventData.time).asMilliseconds());
      }
      eventData.useVariable && setUseVariable(eventData.useVariable);
      if (eventData.lambda) {
        setLambda(eventData.lambda);
      }
      eventData.onVarChange && setOnVarChange(eventData.onVarChange);
      eventData.distType && setDistType(eventData.distType);
      eventData.parameters && setParameters(eventData.parameters);
      eventData.persistent && setPersistent(eventData.persistent);
      eventData.dfltTimeRate && setDfltTimeRate(eventData.dfltTimeRate);
      eventData.timeVariableUnit && setTimeVariableUnit(eventData.timeVariableUnit);
      eventData.fromSimStart && setFromSimStart(eventData.fromSimStart);
      if (eventData.lambdaTimeRate) {
        setLambdaTimeRate(eventData.lambdaTimeRate);
        setFailureRateMilliseconds(dayjs.duration(eventData.lambdaTimeRate).asMilliseconds());
      }
      eventData.extEventType && setExtEventType(eventData.extEventType);
      eventData.variable && setVariable(eventData.variable);
      eventData.window && setWindowPosition(eventData.window);
    }
  };

  const addToUsedVariables = (variableName: string) => {
    setCodeVariables((prevVariables) => {
      const variables = prevVariables ?? [];
      if (variables.includes(variableName)) {
        return variables.filter((variable) => variable !== variableName);
      } else {
        return [...variables, variableName];
      }
    });
  };

  // Map event types to their respective sub-components and props
  const eventTypeToComponent = {
    etVarCond: { component: VarCondition, props: {} },
    etStateCng: { component: StateChange, props: {} },
    etComponentLogic: { component: ComponentLogic, props: {} },
    etTimer: { component: Timer, props: {} },
    etFailRate: { component: FailureRate, props: {} },
    et3dSimEv: { component: ExtSim, props: {} },
    etDistribution: { component: Distribution, props: {} },
  };

  const handleTimerDurationChange = (value: number) => {
    setTimerMilliseconds(value);
    setTime(convertToISOString(value));
  };

  const handleFailureRateDurationChange = (value: number) => {
    setFailureRateMilliseconds(value);
    setLambdaTimeRate(convertToISOString(value));
  };

  const handleChangeEventType = (value: EventType) => {
    setEvType(value);
    setInvalidValues((prevInvalidValues) => {
      const newInvalidValues = new Set(prevInvalidValues);
      newInvalidValues.clear();
      if (value === 'etFailRate') {
        newInvalidValues.add('Lambda');
      } else if (value === 'etDistribution') {
        newInvalidValues.add('Mean').add('Standard Deviation').add('Minimum').add('Maximum');
      } else if (value === 'etComponentLogic') {
        newInvalidValues.add('LogicTop');
      }
      return newInvalidValues;
    });
  };

  const handleSetParameters = (
    row: string,
    value: string | number | boolean | undefined,
    varName: string,
  ) => {
    const newParameters = parameters ? [...parameters] : [];
    let index = newParameters.findIndex((param) => param.name === row);
    if (index === -1) {
      const newParameter = {
        name: row as EventDistributionParameterName,
        value: varName === 'value' ? (value as string | number) : '',
        timeRate:
          varName === 'timeRate'
            ? value === 'default'
              ? undefined
              : (value as TimeVariableUnit)
            : undefined,
        useVariable: varName === 'useVariable' ? (value as boolean) : false,
        variable: varName === 'variable' ? (value as string) : undefined,
      };
      newParameters.push(newParameter);
      index = newParameters.length - 1;
    }

    newParameters[index] = {
      ...newParameters[index],
      [varName]: varName === 'timeRate' && value === 'default' ? undefined : value,
    };
    setParameters(newParameters);
  };
  // const isValidNumber = (value: string) => {
  //   const trimmedValue = value.trim();
  //   if (trimmedValue === '') {
  //     return false;
  //   }
  //   return !isNaN(Number(trimmedValue));
  // };

  const updateRow = (
    row: string,
    value: string | number | boolean | undefined,
    varName: 'value' | 'timeRate' | 'useVariable' | 'variable',
  ) => {
    setAllRows((prevAllRows) => ({
      ...prevAllRows,
      [row]: {
        ...prevAllRows[row],
        value: varName === 'value' ? (value as string | number) : (prevAllRows[row]?.value ?? ''),
        timeRate:
          varName === 'timeRate'
            ? value === 'default'
              ? undefined
              : (value as TimeVariableUnit)
            : (prevAllRows[row]?.timeRate ?? undefined),
        useVariable:
          varName === 'useVariable' ? (value as boolean) : (prevAllRows[row]?.useVariable ?? false),
        variable:
          varName === 'variable' ? (value as string) : (prevAllRows[row]?.variable ?? undefined),
      },
    }));
  };

  // const PositiveFields = ['Standard Deviation', 'Minimum', 'Maximum', 'Shape', 'Rate', 'Scale'];

  const handleChange = (row: string, value: string) => {
    // if (isValidNumber(value as string)) {
    //   value = Number(value);
    //   if (PositiveFields.includes(row)) {
    //     value = Math.abs(value as number);
    //   }
    // }

    handleSetParameters(row, value, 'value');
    updateRow(row, value, 'value');
  };

  const handleBlur = (row: string, value: string) => {
    const validInputRegex = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[Ee][+-]?\d+)?$/;
    if (validInputRegex.test(value)) {
      setInvalidValues((prev) => {
        prev.delete(row);
        return prev;
      });
      // Check if the value is in scientific notation
      const isScientificNotation = /[Ee]/.test(value);
      let numericValue;
      if (isScientificNotation) {
        numericValue = parseFloat(value);
        const exponentPart = value.split(/[Ee]/)[1];
        const exponent = Math.abs(Number(exponentPart));
        if (exponent >= 4) {
          // If it has 4 or more decimal places, keep it in scientific notation
          numericValue = value;
        }
      } else {
        numericValue = parseFloat(value);
      }
      handleSetParameters(row, numericValue, 'value');
      updateRow(row, numericValue, 'value');
    } else {
      setInvalidValues(invalidValues.add(row));
    }
  };

  const handleRateChange = (row: string, value: TimeVariableUnit | undefined) => {
    handleSetParameters(row, value, 'timeRate');
    updateRow(row, value, 'timeRate');
  };

  const handleUseVariableChange = (checked: boolean, row: string) => {
    handleSetParameters(row, checked, 'useVariable');
    updateRow(row, checked, 'useVariable');
    if (typeof onVarChange !== 'string' || onVarChange.length === 0) {
      setOnVarChange('ocIgnore');
    }
  };

  const handleVariableChange = (row: string) => {
    setInvalidValues((prev) => {
      const newInvalidValue = new Set(prev);
      newInvalidValue.delete(row);
      return newInvalidValue;
    });
  };

  const setParameterVariable = (value: string, row: string) => {
    handleSetParameters(row, value, 'variable');
    updateRow(row, value, 'variable');
  };

  const handleNameChange = (newName: string) => {
    const events = appData.value.EventList;
    const trimmedName = newName.trim();
    const nameExists = events
      .filter((event) => event.name !== originalName)
      .some((event) => event.name === trimmedName);
    const hasInvalidChars = /[^a-zA-Z0-9-_\s]/.test(trimmedName);
    setHasError(nameExists || hasInvalidChars);
    setName(newName);
  };

  const reset = () => {
    setCodeVariables(undefined);
    setScriptCode(undefined);
    setVariableName('');
    setTriggerStates([]); // Default value for triggerStates
    setMoveFromCurrent(false); // Default value for moveFromCurrent
    setEventStateIndex(0); // Default value for eventStateIndex
    setOnSuccess(undefined);
    setTriggerOnFalse(undefined);
    setLogicTop(undefined);
    setTime(undefined);
    setTimerMilliseconds(0);
    setUseVariable(undefined);
    setLambda(undefined);
    setOnVarChange(undefined);
    setDistType(undefined);
    setParameters(undefined);
    setPersistent(undefined);
    setUseDistVariable([]); // Default value for useDistVariable
    setDfltTimeRate(undefined);
    setAllRows({}); // Default value for allRows
    setTimeVariableUnit(undefined);
    setFromSimStart(undefined);
    setFailureRateMilliseconds(undefined);
    setLambdaTimeRate(undefined);
    setExtEventType(undefined);
    setVariable(undefined);
    setHasError(false);
    if (evType === 'etStateCng') {
      setAllItems(true); // Default value for allItems
      setIfInState(false);
    }
  };

  const handleSave = (eventData?: Event, state?: State) => {
    event.value = {
      ...event.value,
      id: eventData?.id ?? uuidv4(),
      evType,
      name: name.trim(),
      desc,
      mainItem: true,
      window: windowPosition,
    };
    if (evType === 'et3dSimEv') {
      event.value.extEventType = extEventType;
      if (extEventType === 'etCompEv') {
        event.value = {
          ...event.value,
          code: scriptCode,
          varNames: codeVariables,
          variable,
        };
      }
    } else if (evType === 'etStateCng') {
      event.value = {
        ...event.value,
        ifInState: ifInState ?? false,
        allItems: allItems ?? true,
        triggerStates,
      };
    } else if (evType === 'etTimer') {
      event.value = {
        ...event.value,
        time: time ?? 'P0DT0S',
        dfltTimeRate,
        fromSimStart,
        onVarChange,
        timeVariableUnit,
        useVariable,
        persistent,
      };
    } else if (evType === 'etDistribution') {
      event.value = {
        ...event.value,
        distType: distType ?? 'dtNormal',
        dfltTimeRate: dfltTimeRate,
        parameters: parameters?.map((p) => {
          const parameter = { ...p };
          if (parameter.timeRate === undefined) {
            delete parameter.timeRate;
          }
          if (parameter.variable === undefined) {
            delete parameter.variable;
          }
          return parameter;
        }),
        persistent,
      };
      if (onVarChange !== undefined) {
        event.value.onVarChange = onVarChange;
      }
    } else if (evType === 'etFailRate') {
      event.value = {
        ...event.value,
        lambda,
        lambdaTimeRate,
        onVarChange,
        useVariable,
        persistent,
      };
    } else if (evType === 'etComponentLogic') {
      event.value = {
        ...event.value,
        logicTop,
        triggerOnFalse,
        onSuccess,
      };
    } else {
      event.value.varNames = codeVariables;
      event.value.code = scriptCode;
    }
    eventData
      ? updateEvent(event.value, state, moveFromCurrent)
      : createEvent(event.value, state, moveFromCurrent);
    handleClose();
  };

  const savePosition = (position: WindowPosition) => {
    setWindowPosition(position);
    if (event.value.id !== undefined && event.value.id.length > 0) {
      updateEvent({
        ...event.value,
        window: position,
      });
    }
  };

  return (
    <EventFormContext.Provider
      value={{
        allItems,
        allRows,
        hasError,
        name,
        codeVariables,
        desc,
        dfltTimeRate,
        distType,
        eventStateIndex,
        eventTypeOptions,
        eventTypeToComponent,
        evType,
        extEventType,
        failureRateMilliseconds,
        fromSimStart,
        ifInState,
        lambda,
        lambdaTimeRate,
        logicTop,
        timerMilliseconds,
        moveFromCurrent,
        onSuccess,
        onVarChange,
        parameters,
        persistent,
        scriptCode,
        time,
        timeVariableUnit,
        triggerOnFalse,
        triggerStates,
        useDistVariable,
        useVariable,
        invalidValues,
        variable,
        variableChecked,
        variableName,
        addToUsedVariables,
        handleChange,
        handleBlur,
        handleClose,
        handleTimerDurationChange,
        handleFailureRateDurationChange,
        handleNameChange,
        handleRateChange,
        handleSave,
        savePosition,
        handleSetParameters,
        handleUseVariableChange,
        handleVariableChange,
        handleChangeEventType,
        InitializeForm,
        reset,
        setAllItems,
        setAllRows,
        setCodeVariables,
        setDesc,
        setDfltTimeRate,
        setDistType,
        setEvType,
        setExtEventType,
        setFailureRateMilliseconds,
        setFromSimStart,
        setIfInState,
        setLambda,
        setLambdaTimeRate,
        setLogicTop,
        setParameterVariable,
        setTimerMilliseconds,
        setMoveFromCurrent,
        setName,
        setOnSuccess,
        setOnVarChange,
        setParameters,
        setPersistent,
        setScriptCode,
        setTime,
        setTimeVariableUnit,
        setTriggerOnFalse,
        setTriggerStates,
        setUseDistVariable,
        setUseVariable,
        setVariable,
        setVariableName,
        setInvalidValues,
      }}
    >
      {children}
    </EventFormContext.Provider>
  );
};

export default EventFormContextProvider;
