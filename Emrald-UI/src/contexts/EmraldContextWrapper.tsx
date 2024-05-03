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
import ExtSimContextProvider from './ExtSimContext';

export interface EmraldContextWrapperProps {
  children: React.ReactNode;
}

const EmraldContextWrapper: React.FC<EmraldContextWrapperProps> = ({ children }) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <WindowProvider>
        <ModelDetailsContextProvider>
          <DiagramContextProvider>
            <LogicNodeContextProvider>
              <ActionContextProvider>
                <EventContextProvider>
                  <StateContextProvider>
                    <VariableContextProvider>
                      <ExtSimContextProvider>
                        {children}
                      </ExtSimContextProvider>
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
