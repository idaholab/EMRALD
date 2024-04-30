import React from 'react';
import DiagramContextProvider from './DiagramContext';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { WindowProvider } from './WindowContext';
import LogicNodeContextProvider from './LogicNodeContext';
import ModelDetailsContextProvider from './ModelDetailsContext';
import ActionContextProvider from './ActionContext';
import EventContextProvider from './EventContext';
import StateContextProvider from './StateContext';
import VariableContextProvider from './VariableContext';
import ActionFormContextProvider from '../components/forms/ActionForm/ActionFormContext';

export interface EmraldContextWrapperProps {
  // appData: any;
  // updateAppData: (newData: any) => void;
  children: React.ReactNode;
}

const EmraldContextWrapper: React.FC<EmraldContextWrapperProps> = ({ appData, updateAppData, children }) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <WindowProvider>
        <ModelDetailsContextProvider appData={appData} updateAppData={updateAppData}>
          <DiagramContextProvider appData={appData} updateAppData={updateAppData}>
            <LogicNodeContextProvider appData={appData} updateAppData={updateAppData}>
              <ActionContextProvider appData={appData} updateAppData={updateAppData}>
                <EventContextProvider appData={appData} updateAppData={updateAppData}>
                  <StateContextProvider appData={appData} updateAppData={updateAppData}>
                    <VariableContextProvider appData={appData} updateAppData={updateAppData}>
                      <ActionFormContextProvider>
                      {children}
                      </ActionFormContextProvider>
                    </VariableContextProvider>
                  </StateContextProvider>
                </EventContextProvider>
              </ActionContextProvider>
            </LogicNodeContextProvider>
          </DiagramContextProvider>
        </ModelDetailsContextProvider>
      </WindowProvider>
    </DndProvider>
  );
};

export default EmraldContextWrapper;
