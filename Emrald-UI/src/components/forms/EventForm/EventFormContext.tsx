import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { Event, EventDistributionParameter } from '../../../types/Event';
import { useWindowContext } from '../../../contexts/WindowContext';
import { emptyEvent, useEventContext } from '../../../contexts/EventContext';
import { useSignal } from '@preact/signals-react';
import {
  DistributionType,
  EventDistributionParameterName,
  EventType,
  ExtEventMsgType,
  TimeVariableUnit,
  VarChangeOptions,
} from '../../../types/ItemTypes';
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
import { State } from '../../../types/State';
import dayjs from 'dayjs';
import { appData } from '../../../hooks/useAppData';

interface EventFormContextType {
  allItems: boolean;
  allRows: RowType;
  hasError: boolean;
  name: string;
  codeVariables: string[] | undefined;
  desc: string;
  dfltTimeRate: TimeVariableUnit | undefined;
  distType: DistributionType | undefined;
  eventStateIndex: number;
  eventTypeOptions: { value: string; label: string }[];
  eventTypeToComponent: { [key: string]: { component: any; props: any } };
  evType: EventType;
  extEventType: ExtEventMsgType | undefined | '';
  failureRateMilliseconds: number | undefined;
  fromSimStart: boolean | undefined;
  ifInState: boolean | undefined;
  lambda: string | number | undefined;
  lambdaTimeRate: string | undefined;
  logicTop: string | undefined;
  timerMilliseconds: number | undefined;
  moveFromCurrent: boolean;
  onSuccess: boolean | undefined;
  onVarChange: VarChangeOptions | undefined | '';
  parameters: EventDistributionParameter[] | undefined;
  scriptCode: string | undefined;
  time: string | undefined;
  timeVariableUnit: TimeVariableUnit | undefined;
  triggerOnFalse: boolean | undefined;
  triggerStates: string[];
  useDistVariable: boolean[];
  useVariable: boolean | undefined;
  variable: string | undefined;
  variableChecked: boolean;
  variableName: string;
  addToUsedVariables: (variableName: string) => void;
  handleChange: (row: string, value: string | number) => void;
  handleClose: () => void;
  handleTimerDurationChange: (value: number) => void;
  handleFailureRateDurationChange: (value: number) => void;
  handleNameChange: (value: string) => void;
  handleRateChange: (row: string, value: TimeVariableUnit | undefined) => void;
  handleSave: (eventData?: Event, state?: State) => void;
  handleSetParameters: (
    row: string,
    value: string | number | boolean | TimeVariableUnit | undefined,
    varName: string,
  ) => void;
  handleUseVariableChange: (checked: boolean, row: string) => void;
  InitializeForm: (eventData?: Event | undefined, state?: State) => void;
  reset: () => void;
  setAllItems: React.Dispatch<React.SetStateAction<boolean>>;
  setAllRows: React.Dispatch<React.SetStateAction<RowType>>;
  setCodeVariables: React.Dispatch<React.SetStateAction<string[] | undefined>>;
  setDesc: React.Dispatch<React.SetStateAction<string>>;
  setDfltTimeRate: React.Dispatch<React.SetStateAction<TimeVariableUnit | undefined>>;
  setDistType: React.Dispatch<React.SetStateAction<DistributionType | undefined>>;
  setEvType: React.Dispatch<React.SetStateAction<EventType>>;
  setExtEventType: React.Dispatch<React.SetStateAction<ExtEventMsgType | undefined | ''>>;
  setFailureRateMilliseconds: React.Dispatch<React.SetStateAction<number | undefined>>;
  setFromSimStart: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  setIfInState: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  setLambda: React.Dispatch<React.SetStateAction<string | number | undefined>>;
  setLambdaTimeRate: React.Dispatch<React.SetStateAction<string | undefined>>;
  setLogicTop: React.Dispatch<React.SetStateAction<string | undefined>>;
  setName: React.Dispatch<React.SetStateAction<string>>;
  setMoveFromCurrent: React.Dispatch<React.SetStateAction<boolean>>;
  setOnSuccess: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  setOnVarChange: React.Dispatch<React.SetStateAction<VarChangeOptions | undefined | ''>>;
  setParameters: React.Dispatch<React.SetStateAction<EventDistributionParameter[] | undefined>>;
  setScriptCode: React.Dispatch<React.SetStateAction<string | undefined>>;
  setTime: React.Dispatch<React.SetStateAction<string | undefined>>;
  setTimerMilliseconds: React.Dispatch<React.SetStateAction<number>>;
  setTimeVariableUnit: React.Dispatch<React.SetStateAction<TimeVariableUnit | undefined>>;
  setTriggerOnFalse: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  setTriggerStates: React.Dispatch<React.SetStateAction<string[]>>;
  setUseDistVariable: React.Dispatch<React.SetStateAction<boolean[]>>;
  setUseVariable: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  setParameterVariable: (value: string | undefined, row: string) => void;
  setVariable: React.Dispatch<React.SetStateAction<string | undefined>>;
  setVariableName: React.Dispatch<React.SetStateAction<string>>;
}

const EventFormContext = createContext<EventFormContextType | undefined>(undefined);

export const useEventFormContext = (): EventFormContextType => {
  const context = useContext(EventFormContext);
  if (!context) {
    throw new Error('useActionFormContext must be used within an ActionFormContextProvider');
  }
  return context;
};
type RowType = {
  [key: string]: EventDistributionParameter;
};

const EventFormContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [codeVariables, setCodeVariables] = useState<string[] | undefined>([]);
  const [scriptCode, setScriptCode] = useState<string>();
  const [variableName, setVariableName] = useState<string>('');
  const { handleClose } = useWindowContext();
  const [name, setName] = useState<string>('');
  const [desc, setDesc] = useState<string>('');
  const [evType, setEvType] = useState<EventType>('etStateCng');
  const [ifInState, setIfInState] = useState<boolean>();
  const [triggerStates, setTriggerStates] = useState<string[]>([]);
  const [moveFromCurrent, setMoveFromCurrent] = useState<boolean>(false);
  const [eventStateIndex, setEventStateIndex] = useState<number>(0);
  const [allItems, setAllItems] = useState<boolean>(true);
  const [onSuccess, setOnSuccess] = useState<boolean>();
  const [triggerOnFalse, setTriggerOnFalse] = useState<boolean>();
  const [logicTop, setLogicTop] = useState<string>();
  const [time, setTime] = useState<string>();
  const [timerMilliseconds, setTimerMilliseconds] = useState<number>(0);
  const [useVariable, setUseVariable] = useState<boolean>();
  const [lambda, setLambda] = useState<string | number>();
  const [onVarChange, setOnVarChange] = useState<VarChangeOptions | ''>();
  const [distType, setDistType] = useState<DistributionType>();
  const [parameters, setParameters] = useState<EventDistributionParameter[]>();
  const [useDistVariable, setUseDistVariable] = useState<boolean[]>([]);
  const [dfltTimeRate, setDfltTimeRate] = useState<TimeVariableUnit>();
  const [allRows, setAllRows] = useState<RowType>({});
  const [timeVariableUnit, setTimeVariableUnit] = useState<TimeVariableUnit>();
  const [fromSimStart, setFromSimStart] = useState<boolean>();
  const [failureRateMilliseconds, setFailureRateMilliseconds] = useState<number>();
  const [lambdaTimeRate, setLambdaTimeRate] = useState<string>();
  const [extEventType, setExtEventType] = useState<ExtEventMsgType | ''>();
  const [variable, setVariable] = useState<string>();
  const [hasError, setHasError] = useState<boolean>(false);
  const [originalName, setOriginalName] = useState<string>();

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
    .map((row: any) => row.useVariable)
    .some((val: boolean) => val === true);

  const InitializeForm = (eventData?: Event | undefined, state?: State) => {
    if (eventData) {
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
        var checked = state.eventActions[eventIndex].moveFromCurrent;
        setMoveFromCurrent(checked);
      }
      setAllItems(eventData.allItems ? true : false);
      setOnSuccess(eventData.onSuccess);
      setTriggerOnFalse(eventData.triggerOnFalse);
      eventData.logicTop && setLogicTop(eventData.logicTop);
      if (eventData.time) {
        setTime(eventData.time);
        setTimerMilliseconds(dayjs.duration(eventData.time).asMilliseconds());
      }
      eventData.useVariable && setUseVariable(eventData.useVariable);
      setLambda(eventData.lambda !== undefined ? eventData.lambda : '');
      eventData.onVarChange && setOnVarChange(eventData.onVarChange);
      eventData.distType && setDistType(eventData.distType);
      eventData.parameters && setParameters(eventData.parameters);
      eventData.dfltTimeRate && setDfltTimeRate(eventData.dfltTimeRate);
      eventData.timeVariableUnit && setTimeVariableUnit(eventData.timeVariableUnit);
      eventData.fromSimStart && setFromSimStart(eventData.fromSimStart);
      if (eventData.lambdaTimeRate) {
        setLambdaTimeRate(eventData.lambdaTimeRate);
        setFailureRateMilliseconds(dayjs.duration(eventData.lambdaTimeRate).asMilliseconds());
      }
      eventData.extEventType && setExtEventType(eventData.extEventType);
      eventData.variable && setVariable(eventData.variable);
    }
  };

  const addToUsedVariables = (variableName: string) => {
    setCodeVariables((prevVariables) => {
      const variables = prevVariables || [];
      if (variables.includes(variableName)) {
        return variables.filter((variable) => variable !== variableName);
      } else {
        return [...variables, variableName];
      }
    });
  };

  // Map event types to their respective sub-components and props
  const eventTypeToComponent: { [key in EventType]: { component: React.FC<any>; props: any } } = {
    etVarCond: { component: VarCondition, props: {} },
    etStateCng: { component: StateChange, props: {} },
    etComponentLogic: { component: ComponentLogic, props: {} },
    etTimer: { component: Timer, props: {} },
    etFailRate: { component: FailureRate, props: {} },
    et3dSimEv: { component: ExtSim, props: {} },
    etDistribution: { component: Distribution, props: {} },
  };
  const handleTimerDurationChange = (value: any) => {
    setTimerMilliseconds(value);
    setTime(dayjs.duration(value).toISOString());
  };
  const handleFailureRateDurationChange = (value: number) => {
    setFailureRateMilliseconds(value);
    setLambdaTimeRate(dayjs.duration(value).toISOString());
  };

  const handleSetParameters = (
    row: string,
    value: string | number | boolean | TimeVariableUnit | undefined,
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
  const isValidNumber = (value: string) => {
    const trimmedValue = value.trim();
    if (trimmedValue === '') {
      return false;
    }
    return !isNaN(Number(trimmedValue));
  };

  const updateRow = (
    row: string,
    value: string | number | boolean | TimeVariableUnit | undefined,
    varName: 'value' | 'timeRate' | 'useVariable' | 'variable',
  ) => {
    setAllRows((prevAllRows) => ({
      ...prevAllRows,
      [row]: {
        ...prevAllRows[row],
        value: varName === 'value' ? (value as string | number) : prevAllRows[row]?.value || '',
        timeRate:
          varName === 'timeRate'
            ? value === 'default'
              ? undefined
              : (value as TimeVariableUnit)
            : prevAllRows[row]?.timeRate || undefined,
        useVariable:
          varName === 'useVariable' ? (value as boolean) : prevAllRows[row]?.useVariable || false,
        variable:
          varName === 'variable' ? (value as string) : prevAllRows[row]?.variable || undefined,
      },
    }));
  };

  const PositiveFields = ['Standard Deviation', 'Minimum', 'Maximum', 'Shape', 'Rate', 'Scale'];

  const handleChange = (row: string, value: string | number) => {
    if (isValidNumber(value as string)) {
      value = Number(value);
      if (PositiveFields.includes(row)) {
        value = Math.abs(value as number);
      }
    }

    handleSetParameters(row, value, 'value');
    updateRow(row, value, 'value');
  };

  const handleRateChange = (row: string, value: TimeVariableUnit | undefined) => {
    handleSetParameters(row, value, 'timeRate');
    updateRow(row, value, 'timeRate');
  };

  const handleUseVariableChange = (checked: boolean, row: string) => {
    handleSetParameters(row, checked, 'useVariable');
    updateRow(row, checked, 'useVariable');
  };

  const setParameterVariable = (value: string | undefined, row: string) => {
    handleSetParameters(row, value, 'variable');
    updateRow(row, value, 'variable');
  };
  const handleNameChange = (newName: string) => {
    const events = appData.value.EventList;
    const trimmedName = newName.trim();
    const nameExists = events
      .filter((event) => event.name !== originalName)
      .some((event) => event.name === trimmedName);
    const hasInvalidChars = /[^a-zA-Z0-9-_ ]/.test(trimmedName);
    setHasError(nameExists || hasInvalidChars);
    setName(newName);
  };

  const reset = () => {
    setCodeVariables(undefined);
    setScriptCode(undefined);
    setVariableName('');
    setIfInState(undefined);
    setTriggerStates([]); // Default value for triggerStates
    setMoveFromCurrent(false); // Default value for moveFromCurrent
    setEventStateIndex(0); // Default value for eventStateIndex
    setAllItems(true); // Default value for allItems
    setOnSuccess(undefined);
    setTriggerOnFalse(undefined);
    setLogicTop(undefined);
    setTime(undefined);
    setTimerMilliseconds(0);
    setUseVariable(undefined);
    setLambda(undefined);
    setOnVarChange('');
    setDistType(undefined);
    setParameters(undefined);
    setUseDistVariable([]); // Default value for useDistVariable
    setDfltTimeRate(undefined);
    setAllRows({}); // Default value for allRows
    setTimeVariableUnit(undefined);
    setFromSimStart(undefined);
    setFailureRateMilliseconds(undefined);
    setLambdaTimeRate(undefined);
    setExtEventType(''); // Default value for extEventType
    setVariable(undefined);
    setHasError(false);
  };

  const handleSave = (eventData?: Event, state?: State) => {
    event.value = {
      ...event.value,
      id: eventData?.id || uuidv4(),
      evType,
      name: name.trim(),
      desc,
      code: scriptCode,
      varNames: codeVariables,
      triggerStates,
      ifInState,
      allItems,
      onSuccess,
      triggerOnFalse,
      logicTop,
      time: time ? time : dayjs.duration(0).toISOString(),
      timeVariableUnit,
      useVariable,
      lambda,
      onVarChange: onVarChange ? onVarChange : undefined,
      distType,
      parameters,
      dfltTimeRate,
      fromSimStart,
      lambdaTimeRate,
      extEventType: extEventType ? extEventType : undefined,
      variable,
      mainItem: true,
    };
    eventData
      ? updateEvent(event.value, state, moveFromCurrent)
      : createEvent(event.value, state, moveFromCurrent);
    handleClose();
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
        scriptCode,
        time,
        timeVariableUnit,
        triggerOnFalse,
        triggerStates,
        useDistVariable,
        useVariable,
        variable,
        variableChecked,
        variableName,
        addToUsedVariables,
        handleChange,
        handleClose,
        handleTimerDurationChange,
        handleFailureRateDurationChange,
        handleNameChange,
        handleRateChange,
        handleSave,
        handleSetParameters,
        handleUseVariableChange,
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
        setScriptCode,
        setTime,
        setTimeVariableUnit,
        setTriggerOnFalse,
        setTriggerStates,
        setUseDistVariable,
        setUseVariable,
        setVariable,
        setVariableName,
      }}
    >
      {children}
    </EventFormContext.Provider>
  );
};

export default EventFormContextProvider;
