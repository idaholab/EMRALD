import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { Event, EventDistributionParameter } from '../../../types/Event';
import { useWindowContext } from '../../../contexts/WindowContext';
import { emptyEvent, useEventContext } from '../../../contexts/EventContext';
import { useSignal } from '@preact/signals-react';
import {
  DistributionType,
  EventDistributionParameterName,
  EventType,
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

interface EventFormContextType {
  allItems: boolean;
  allRows: RowType;
  name: string;
  codeVariables: string[];
  desc: string;
  dfltTimeRate: TimeVariableUnit;
  distType: DistributionType;
  eventStateIndex: number;
  eventTypeOptions: { value: string; label: string }[];
  eventTypeToComponent: { [key: string]: { component: any; props: any } };
  evType: EventType;
  ifInState: boolean;
  lambda: string | number | undefined;
  logicTop: string;
  milliseconds: number;
  moveFromCurrent: boolean;
  onSuccess: boolean | undefined;
  onVarChange: VarChangeOptions;
  parameters: EventDistributionParameter[];
  scriptCode: string;
  time: string | undefined;
  triggerOnFalse: boolean | undefined;
  triggerStates: string[];
  useDistVariable: boolean[];
  useVariable: boolean | undefined;
  variableChecked: boolean;
  variableName: string;
  addToUsedVariables: (variableName: string) => void;
  handleChange: (row: string, value: string | number) => void;
  handleClose: () => void;
  handleDurationChange: (value: number) => void;
  handleRateChange: (row: string, value: TimeVariableUnit | undefined) => void;
  handleSave: (eventData?: Event, state?: State) => void;
  handleSetParameters: (
    row: string,
    value: string | number | boolean | TimeVariableUnit | undefined,
    varName: string,
  ) => void;
  handleUseVariableChange: (checked: boolean, row: string) => void;
  InitializeForm: (eventData?: Event | undefined, state?: State) => void;
  setAllItems: React.Dispatch<React.SetStateAction<boolean>>;
  setAllRows: React.Dispatch<React.SetStateAction<RowType>>;
  setDesc: React.Dispatch<React.SetStateAction<string>>;
  setDfltTimeRate: React.Dispatch<React.SetStateAction<TimeVariableUnit>>;
  setDistType: React.Dispatch<React.SetStateAction<DistributionType>>;
  setEvType: React.Dispatch<React.SetStateAction<EventType>>;
  setIfInState: React.Dispatch<React.SetStateAction<boolean>>;
  setLambda: React.Dispatch<React.SetStateAction<string | number | undefined>>;
  setLogicTop: React.Dispatch<React.SetStateAction<string>>;
  setName: React.Dispatch<React.SetStateAction<string>>;
  setMilliseconds: React.Dispatch<React.SetStateAction<number>>;
  setMoveFromCurrent: React.Dispatch<React.SetStateAction<boolean>>;
  setOnSuccess: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  setOnVarChange: React.Dispatch<React.SetStateAction<VarChangeOptions>>;
  setParameters: React.Dispatch<React.SetStateAction<EventDistributionParameter[]>>;
  setScriptCode: React.Dispatch<React.SetStateAction<string>>;
  setTime: React.Dispatch<React.SetStateAction<string | undefined>>;
  setTriggerOnFalse: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  setTriggerStates: React.Dispatch<React.SetStateAction<string[]>>;
  setUseDistVariable: React.Dispatch<React.SetStateAction<boolean[]>>;
  setUseVariable: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  setVariable: (value: string | undefined, row: string) => void;
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
  const [codeVariables, setCodeVariables] = useState<string[]>([]);
  const [scriptCode, setScriptCode] = useState<string>('');
  const [variableName, setVariableName] = useState<string>('');
  const { handleClose } = useWindowContext();
  const [name, setName] = useState<string>('');
  const [desc, setDesc] = useState<string>('');
  const [evType, setEvType] = useState<EventType>('etStateCng');
  const [ifInState, setIfInState] = useState<boolean>(false);
  const [triggerStates, setTriggerStates] = useState<string[]>([]);
  const [moveFromCurrent, setMoveFromCurrent] = useState<boolean>(false);
  const [actions, setActions] = useState<string[]>([]);
  const [eventStateIndex, setEventStateIndex] = useState<number>(0);
  const [allItems, setAllItems] = useState<boolean>(true);
  const [onSuccess, setOnSuccess] = useState<boolean>();
  const [triggerOnFalse, setTriggerOnFalse] = useState<boolean>();
  const [logicTop, setLogicTop] = useState<string>('');
  const [time, setTime] = useState<string>();
  const [milliseconds, setMilliseconds] = useState(0);
  const [useVariable, setUseVariable] = useState<boolean>();
  const [lambda, setLambda] = useState<string | number>();
  const [onVarChange, setOnVarChange] = useState<VarChangeOptions>('ocIgnore');
  const [distType, setDistType] = useState<DistributionType>('dtNormal');
  const [parameters, setParameters] = useState<EventDistributionParameter[]>([]);
  const [useDistVariable, setUseDistVariable] = useState<boolean[]>([]);
  const [dfltTimeRate, setDfltTimeRate] = useState<TimeVariableUnit>('trHours');
  const [allRows, setAllRows] = useState<RowType>({});

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
        setMilliseconds(dayjs.duration(eventData.time).asMilliseconds());
      }
      eventData.useVariable && setUseVariable(eventData.useVariable);
      setLambda(eventData.lambda ? eventData.lambda : '');
      setOnVarChange(eventData.onVarChange ? eventData.onVarChange : 'ocIgnore');
      setDistType(eventData.distType ? eventData.distType : 'dtNormal');
      eventData.parameters && setParameters(eventData.parameters);
      setDfltTimeRate(eventData.dfltTimeRate ? eventData.dfltTimeRate : 'trHours');
    }
  };

  const addToUsedVariables = (variableName: string) => {
    if (!codeVariables.includes(variableName)) {
      setCodeVariables([...codeVariables, variableName]);
    } else {
      setCodeVariables(codeVariables.filter((item) => item !== variableName));
    }
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
  const handleDurationChange = (value: number) => {
    setMilliseconds(value);
    setTime(dayjs.duration(value).toISOString());
  };

  const handleSetParameters = (
    row: string,
    value: string | number | boolean | TimeVariableUnit | undefined,
    varName: string,
  ) => {
    const newParameters = [...parameters];
    let index = newParameters.findIndex((param) => param.name === row);
    if (index === -1) {
      const newParameter = {
        name: row as EventDistributionParameterName,
        value: varName === 'value' ? (value as string | number) : '',
        timeRate: varName === 'timeRate' ? (value as TimeVariableUnit) : dfltTimeRate,
        useVariable: varName === 'useVariable' ? (value as boolean) : false,
        variable: varName === 'variable' ? (value as string) : '',
      };
      newParameters.push(newParameter);
      index = newParameters.length - 1;
    }

    newParameters[index] = {
      ...newParameters[index],
      [varName]: value,
    };
    setParameters(newParameters);
  };
  const isValidNumber = (value: string) => {
    return !isNaN(Number(value.trim()));
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
          varName === 'timeRate' ? (value as TimeVariableUnit) : prevAllRows[row]?.timeRate || '',
        useVariable:
          varName === 'useVariable' ? (value as boolean) : prevAllRows[row]?.useVariable || false,
        variable: varName === 'variable' ? (value as string) : prevAllRows[row]?.variable || '',
      },
    }));
  };

  const handleChange = (row: string, value: string | number) => {
    if (isValidNumber(value as string)) {
      value = Number(value);
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

  const setVariable = (value: string | undefined, row: string) => {
    handleSetParameters(row, value, 'variable');
    updateRow(row, value, 'variable');
  };

  const handleSave = (eventData?: Event, state?: State) => {
    event.value = {
      ...event.value,
      id: eventData?.id || uuidv4(),
      evType,
      name,
      desc,
      code: scriptCode,
      varNames: codeVariables,
      triggerStates,
      ifInState,
      allItems,
      onSuccess,
      triggerOnFalse,
      logicTop,
      time,
      useVariable,
      lambda: lambda ? lambda : undefined,
      onVarChange,
      distType,
      parameters,
      dfltTimeRate,
    };
    eventData
      ? updateEvent(event.value, state, actions, moveFromCurrent, eventStateIndex)
      : createEvent(event.value, state, actions, moveFromCurrent);
    handleClose();
  };

  return (
    <EventFormContext.Provider
      value={{
        allItems,
        allRows,
        name,
        codeVariables,
        desc,
        dfltTimeRate,
        distType,
        eventStateIndex,
        eventTypeOptions,
        eventTypeToComponent,
        evType,
        ifInState,
        lambda,
        logicTop,
        milliseconds,
        moveFromCurrent,
        onSuccess,
        onVarChange,
        parameters,
        scriptCode,
        time,
        triggerOnFalse,
        triggerStates,
        useDistVariable,
        useVariable,
        variableChecked,
        variableName,
        addToUsedVariables,
        handleChange,
        handleClose,
        handleDurationChange,
        handleRateChange,
        handleSave,
        handleSetParameters,
        handleUseVariableChange,
        InitializeForm,
        setAllItems,
        setAllRows,
        setDesc,
        setDfltTimeRate,
        setDistType,
        setEvType,
        setIfInState,
        setLambda,
        setLogicTop,
        setMilliseconds,
        setMoveFromCurrent,
        setName,
        setOnSuccess,
        setOnVarChange,
        setParameters,
        setScriptCode,
        setTime,
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
