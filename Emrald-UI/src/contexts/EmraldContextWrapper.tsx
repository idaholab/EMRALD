import React from 'react';
import DiagramContextProvider from './DiagramContext';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { WindowProvider } from './WindowContext';
import LogicNodeContextProvider from './LogicNodeContext';
import ModelDetailsContextProvider from './ModelDetailsContext';
import ActionContextProvider from './ActionContext';
import EventContextProvider from './EventContext';
import StateContextProvider from './StateContext';
import VariableContextProvider from './VariableContext';
import ExtSimContextProvider from './ExtSimContext';
import TemplateContextProvider from './TemplateContext';
import { AlertProvider } from './AlertContext';

dayjs.extend(duration);

export interface EmraldContextWrapperProps {
  children: React.ReactNode;
}

const EmraldContextWrapper: React.FC<EmraldContextWrapperProps> = ({ children }) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <WindowProvider>
        <AlertProvider>
          <ModelDetailsContextProvider>
            <DiagramContextProvider>
              <LogicNodeContextProvider>
                <ActionContextProvider>
                  <EventContextProvider>
                    <StateContextProvider>
                      <VariableContextProvider>
                        <ExtSimContextProvider>
                          <TemplateContextProvider>
                            {children}
                          </TemplateContextProvider>
                        </ExtSimContextProvider>
                      </VariableContextProvider>
                    </StateContextProvider>
                  </EventContextProvider>
                </ActionContextProvider>
              </LogicNodeContextProvider>
            </DiagramContextProvider>
          </ModelDetailsContextProvider>
        </AlertProvider>
      </WindowProvider>
    </DndProvider>
  );
};

export default EmraldContextWrapper;
